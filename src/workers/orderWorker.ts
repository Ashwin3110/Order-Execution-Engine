import { Worker } from "bullmq";
import redis from "../store/redis";
import { getOrder, updateOrder, deleteOrder } from "../store/orderStore";
import { getBestDex } from "../engine/router";
import {
  buildAndSimulateTransaction,
} from "../engine/transactionBuilder";
import { isSlippageAcceptable } from "../engine/slippage";
import { saveFinalOrder } from "../utils/orderRepository";

let attemptCount: Record<string, number> = {};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const worker = new Worker(
  "order-queue",
  async (job) => {
    const { orderId } = job.data;

    const order = await getOrder(orderId);
    if (!order) throw new Error("Order not found");

    // pending → routing
    await updateOrder(orderId, { status: "routing" });
    const bestQuote = await getBestDex(order.amount);

    // routing → building
    await updateOrder(orderId, {
      status: "building",
      dex: bestQuote.dex,
    });

    const tx = buildAndSimulateTransaction(
      bestQuote.outputAmount
    );

    // slippage check
    const MAX_SLIPPAGE = 3;
    const ok = isSlippageAcceptable(
      bestQuote.outputAmount,
      tx.executedOutput,
      MAX_SLIPPAGE
    );

    if (!ok) {
      throw new Error("Slippage too high");
    }


    // building → submitted
    await updateOrder(orderId, {
      status: "submitted",
      txHash: tx.txHash,
    });
    await delay(1000);

    // submitted → confirmed
    await updateOrder(orderId, {
      status: "confirmed",
      dex: bestQuote.dex,
    });

    await saveFinalOrder({
      orderId,
      status: "confirmed",
      dex: bestQuote.dex,
      finalPrice: tx.executedOutput,
      txHash: tx.txHash,
    });

    // cleanup Redis
    await deleteOrder(orderId);
  },
  {
    connection: redis,
    concurrency: 10,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  const orderId = job?.data.orderId;
  if (!orderId) return;

  await saveFinalOrder({
    orderId,
    status: "failed",
    error: err.message,
  });

  await deleteOrder(orderId);

  console.error(`Order ${orderId} permanently failed`);
});
