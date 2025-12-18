import { Pool } from "pg";

/**
 * PostgreSQL connection
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set in environment variables");
}

export const pgPool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pgPool.on("connect", () => {
  console.log("🟢 PostgreSQL connected");
});

pgPool.on("error", (err) => {
  console.error("🔴 PostgreSQL error:", err);
});
