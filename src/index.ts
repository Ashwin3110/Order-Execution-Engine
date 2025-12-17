import Fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
import { createOrder, getOrder } from "./store/orderStore";
import { orderQueue } from "./queue/orderQueue";
import { WebSocketServer } from "ws";
import { registerSocket } from "./ws/socketManager";
import "./workers/orderWorker";
const server = Fastify({ logger: true });

server.get("/health", async () => {
    return { status: "ok" };
});

// TEMP endpoint to create an order
server.get("/create-order", async () => {
    const orderId = uuidv4();

    await createOrder({
        orderId,
        status: "pending",
        tokenIn: "SOL",
        tokenOut: "USDC",
        amount: 1,
        dex: null,
        txHash: null,
        error: null,
        createdAt: new Date().toISOString(),
    });

    await orderQueue.add("execute-order", { orderId });

    return {
        message: "Order created",
        orderId,
    };
});

const start = async () => {
    await server.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
};

start();

const wss = new WebSocketServer({
    server: server.server,
});

wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");

    ws.on("message", async (message) => {
        const { orderId } = JSON.parse(message.toString());

        const order = await getOrder(orderId);
        if (!order) {
            ws.send(JSON.stringify({ error: "Order not found" }));
            return;
        }

        registerSocket(orderId, ws);

        // Send current state immediately
        ws.send(JSON.stringify(order));
    });

    ws.on("close", () => {
    console.log("WebSocket disconnected");
    });
});

