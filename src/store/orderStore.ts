import redis from "./redis";
import { ActiveOrder, OrderStatus } from "../types/order";
import { pushUpdate } from "../ws/socketManager";

const ORDER_KEY_PREFIX = "order:";

export async function createOrder(order: ActiveOrder) {
  const key = ORDER_KEY_PREFIX + order.orderId;
  await redis.set(key, JSON.stringify(order));
}

// Update order status / fields
export async function updateOrder(
  orderId: string,
  updates: Partial<ActiveOrder>
) {
  const key = ORDER_KEY_PREFIX + orderId;
  const existing = await redis.get(key);

  if (!existing) {
    throw new Error("Order not found in Redis");
  }

  const parsed: ActiveOrder = JSON.parse(existing);
  const updated = {
    ...JSON.parse(existing),
    ...updates,
  };
  await redis.set(key, JSON.stringify(updated));
  pushUpdate(orderId, updated);
}

// Fetch order
export async function getOrder(orderId: string): Promise<ActiveOrder | null> {
  const key = ORDER_KEY_PREFIX + orderId;
  const value = await redis.get(key);

  return value ? JSON.parse(value) : null;
}

// Delete order (after completion)
export async function deleteOrder(orderId: string) {
  const key = ORDER_KEY_PREFIX + orderId;
  await redis.del(key);
}