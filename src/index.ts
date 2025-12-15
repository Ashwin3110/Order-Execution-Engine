import Fastify from "fastify";
import { WebSocketServer } from "ws";

const server = Fastify({ logger: true });

// HTTP route
server.get("/health", async () => {
    return { status: "ok" };
});

const start = async () => {
    try {
        // Start Fastify
        await server.listen({ port: 3000 });
        console.log("🚀 HTTP server running at http://localhost:3000");

        // Attach WebSocket server to Fastify's HTTP server
        const wss = new WebSocketServer({
            server: server.server
        });

        wss.on("connection", (ws, req) => {
            console.log("🔌 WebSocket client connected");

            ws.send(
                JSON.stringify({ message: "WebSocket connected successfully" })
            );

            ws.on("message", (message: any) => {
                console.log("📩 Received:", message.toString());

                ws.send(
                    JSON.stringify({ echo: message.toString() })
                );
            });

            ws.on("close", () => {
                console.log("❌ WebSocket client disconnected");
            });
        });

    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
