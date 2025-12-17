import { Worker } from "bullmq";
import redis from "../store/redis";
import {
  getOrder,
  updateOrder,
  deleteOrder,
} from "../store/orderStore";

import { getBestDex } from "../engine/router";
import { buildAndSendRaydiumSwap } from "../engine/transactionBuilder";
import { executeMeteoraSwap } from "../engine/meteoraExecutor";
import { saveFinalOrder } from "../utils/orderRepository";

/**
 * Small delay helper
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
    console.log(`🟡 Processing order ${orderId}`);

    /**
     * 1️⃣ Fetch order
     */
    const order = await getOrder(orderId);
    if (!order) {
      console.error(`❌ Order ${orderId} not found`);
      throw new Error("Order not found");
    }

    /**
     * pending → routing
     */
    console.log(`🔄 [${orderId}] Status → routing`);
    await updateOrder(orderId, { status: "routing" });

    /**
     * 2️⃣ Get best DEX
     */
    const bestQuote = await getBestDex(order.amount);
    console.log(
      `📊 [${orderId}] Best DEX: ${bestQuote.dex} | Expected output: ${bestQuote.outputAmount}`
    );

    /**
     * routing → building
     */
    console.log(
      `🏗️ [${orderId}] Status → building (DEX: ${bestQuote.dex})`
    );
    await updateOrder(orderId, {
      status: "building",
      dex: bestQuote.dex,
    });

    /**
     * 3️⃣ Slippage protection (3%)
     */
    const minOut = bestQuote.outputAmount * 0.97;
    console.log(
      `🛡️ [${orderId}] Slippage check: minOut = ${minOut}`
    );

    let txHash: string;

    /**
     * 4️⃣ Execute swap
     */
    if (bestQuote.dex === "Raydium") {
      console.log(`⚡ [${orderId}] Executing on Raydium`);
      txHash = await buildAndSendRaydiumSwap(
        order.amount,
        minOut
      );
    } else {
      console.log(`⚡ [${orderId}] Executing on Meteora`);
      txHash = await executeMeteoraSwap(
        bestQuote.poolAddress,
        order.amount,
        minOut
      );
    }

    /**
     * building → submitted
     */
    console.log(
      `📤 [${orderId}] Status → submitted | txHash: ${txHash}`
    );
    await updateOrder(orderId, {
      status: "submitted",
      txHash,
    });

    // Give network some time
    await delay(1000);

    /**
     * submitted → confirmed
     */
    console.log(`✅ [${orderId}] Status → confirmed`);
    await updateOrder(orderId, {
      status: "confirmed",
      dex: bestQuote.dex,
    });

    /**
     * 5️⃣ Persist final order
     */
    console.log(`💾 [${orderId}] Saving final order to DB`);
    await saveFinalOrder({
      orderId,
      status: "confirmed",
      dex: bestQuote.dex,
      finalPrice: bestQuote.outputAmount,
      txHash,
    });

    /**
     * 6️⃣ Cleanup Redis
     */
    console.log(`🧹 [${orderId}] Cleaning up Redis`);
    await deleteOrder(orderId);

    console.log(`🎉 [${orderId}] Order completed successfully`);
  },
  {
    connection: redis,
    concurrency: 10, // max 10 concurrent orders
  }
);

/**
 * Job completed
 */
worker.on("completed", (job) => {
  console.log(`🏁 Job ${job.id} completed`);
});

/**
 * Job failed after retries
 */
worker.on("failed", async (job, err) => {
  const orderId = job?.data?.orderId;

  console.error(
    `🔥 Order ${orderId} permanently failed:`,
    err.message
  );

  if (orderId) {
    await saveFinalOrder({
      orderId,
      status: "failed",
      error: err.message,
    });

    await deleteOrder(orderId);
  }
});

export default worker;
