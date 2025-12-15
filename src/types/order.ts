export type OrderStatus =
  | "pending"
  | "routing"
  | "building"
  | "submitted"
  | "confirmed"
  | "failed";

export interface ActiveOrder {
  orderId: string;
  status: OrderStatus;
  tokenIn: string;
  tokenOut: string;
  amount: number;
  dex?: string | null;
  txHash?: string | null;
  error?: string | null;
  createdAt: string;
}