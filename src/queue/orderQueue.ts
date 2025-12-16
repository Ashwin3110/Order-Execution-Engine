import { Queue } from "bullmq";
import redis from "../store/redis";

// Create a queue
export const orderQueue = new Queue("order-queue", {
  connection:redis,
  defaultJobOptions: {
    attempts: 3, // 🔁 max retries
    backoff: {
      type: "exponential",
      delay: 1000, // 1 second base delay
    },
    removeOnComplete: true,
    removeOnFail: false, // keep failed jobs for inspection
  },
});