import { Worker } from "bullmq";
import redis from "../store/redis";
import {
  getOrder,
  updateOrder,
  deleteOrder,
} from "../store/orderStore";

import { getBestDex } from "../engine/router";
// import { buildAndSendRaydiumSwap } from "../engine/transactionBuilder";
// import { executeMeteoraSwap } from "../engine/meteoraExecutor";
import { saveFinalOrder } from "../utils/orderRepository";
import { mockRaydiumSwap } from "../engine/radiyumMock";
import { mockMeteoraSwap } from "../engine/meteoraMock";
/**
 * Delay helper
 */
const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

console.log("🚀 Order Worker starting...");

/**
 * Order execution worker
 */
const worker = new Worker(
  "order-queue",
  async (job) => {
    const { orderId } = job.data;
    console.log(`${orderId} Processing order → Pending`);
    /**
     * 1️⃣ Fetch order
     */
    const order = await getOrder(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    /**
     * pending → routing
     */
    console.log(`[${orderId}] Pending → Routing`);
    await updateOrder(orderId, { status: "routing" });

    /**
     * 2️⃣ Get best DEX
     */
    const bestQuote = await getBestDex(order.amount);
    console.log(`[${orderId}] Best DEX: ${bestQuote.dex}`);
    console.log(`[${orderId}] Expected output: ${bestQuote.outputAmount}`);

    /**
     * routing → building
     */
    console.log(`[${orderId}] Routing → building`);
    await updateOrder(orderId, {
      status: "building",
      dex: bestQuote.dex,
    });

    /**
     * Slippage protection
     */
    const minOut = bestQuote.outputAmount * 0.97;

    let txHash: string;

    /**
     * Execute swap
     */
    if (bestQuote.dex === "Raydium") {
      txHash = await mockRaydiumSwap(
        order.amount,
        minOut
      );
    } else {
      txHash = await mockMeteoraSwap(
        order.amount,
        minOut
      );
    }

    /**
     * building → submitted
     */
    console.log(
      `[${orderId}] building → Submitted`
    );
    await updateOrder(orderId, {
      status: "submitted",
      txHash,
    });

    await delay(1000);

    /**
     * submitted → confirmed
     */
    console.log(` [${orderId}] Submitted → confirmed`);
    await updateOrder(orderId, {
      status: "confirmed",
      dex: bestQuote.dex,
    });

    /**
     * Persist success
     */
    await   ({
      orderId,
      status: "confirmed",
      dex: bestQuote.dex,
      finalPrice: bestQuote.outputAmount,
      txHash,
    });

    /**
     * Cleanup Redis on success
     */
    console.log(
      `[${orderId}] Cleaning up Redis (success)`
    );
    // await deleteOrder(orderId);
  },
  {
    connection: redis,
    concurrency: 10,
  }
);

/**
 * Failed handler (fires on every failed attempt)
 */
worker.on("failed", async (job, err) => {
  const orderId = job?.data?.orderId;
  if (!orderId) return;

  const attemptsMade = job.attemptsMade;
  const maxAttempts = job.opts.attempts ?? 1;

  console.error(
    `[${orderId}] Attempt ${attemptsMade}/${maxAttempts} failed: ${err.message}`
  );

  /**
   * ❗ Only cleanup on FINAL failure
   */
  if (attemptsMade + 1 >= maxAttempts) {
    console.error(
      `[${orderId}] Final failure. Cleaning up.`
    );

    await saveFinalOrder({
      orderId,
      status: "failed",
      error: err.message,
    });

    // await deleteOrder(orderId);
  } else {
    console.log(
      `[${orderId}] Retrying... (${attemptsMade + 1}/${maxAttempts})`
    );
  }
});

export default worker;
