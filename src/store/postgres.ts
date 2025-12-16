import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "admin",
  database: "order_engine",
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

export default pool;