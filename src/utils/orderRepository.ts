import { pgPool } from "../store/postgres";

export async function saveFinalOrder({
  orderId,
  status,
  dex,
  finalPrice,
  txHash,
  error,
}: {
  orderId: string;
  status: "confirmed" | "failed";
  dex?: string | null;
  finalPrice?: number | null;
  txHash?: string | null;
  error?: string | null;
}) {

  // INSERT (idempotent)
  await pgPool.query(
    `
    INSERT INTO orders (order_id, status, dex, final_price, tx_hash, error)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (order_id) DO NOTHING
    `,
    [orderId, status, dex, finalPrice, txHash, error]
  );

  // READ BACK from DB
  const result = await pgPool.query(
    `
    SELECT *
    FROM orders
    WHERE order_id = $1
    `,
    [orderId]
  );

  console.log("[DB] Order record from DB:");
  console.table(result.rows);
}
