🚀 Order Execution Engine (DEX Routing System)

A real-time order execution engine that processes market orders, dynamically routes trades across multiple DEXs, and streams live execution updates via WebSockets.
Built with a production-inspired architecture using queues, retries, and persistent storage.

⚠️ Note: Raydium and Meteora are mocked for execution and pricing to focus on system design, concurrency, and lifecycle handling.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📌 Features

✅ Market order execution flow
🔁 Dynamic DEX routing (Raydium vs Meteora)
⚡ Real-time status updates via WebSockets
🧵 Concurrent order processing with retries
🧠 Slippage protection
🗄️ Redis for transient state, PostgreSQL for final order history
☁️ Cloud-ready deployment (Render + Upstash + Neon)
