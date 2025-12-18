import IORedis from "ioredis";

/**
 * Redis connection
 * Used by BullMQ + order store
 */
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("❌ REDIS_URL is not set in environment variables");
}

const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, // required by BullMQ
});

redis.on("connect", () => {
  console.log("🟢 Redis connected");
});

redis.on("error", (err) => {
  console.error("🔴 Redis connection error:", err);
});

export default redis;
