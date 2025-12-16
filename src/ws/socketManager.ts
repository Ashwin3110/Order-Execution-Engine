import { WebSocket } from "ws";

const orderSockets = new Map<string, WebSocket>();

export function registerSocket(orderId: string, ws: WebSocket) {
  orderSockets.set(orderId, ws);
}

export function unregisterSocket(orderId: string) {
  orderSockets.delete(orderId);
}

export function pushUpdate(orderId: string, data: any) {
  const ws = orderSockets.get(orderId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}