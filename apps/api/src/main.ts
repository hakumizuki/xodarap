import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { appRouter } from "./router";
import { createContext, createWSContext } from "./trpc";

// Load environment variables
dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT as string) || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tRPC API endpoint
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });
const wssHandler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createWSContext,
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`tRPC API available at http://localhost:${port}/api/trpc`);
  console.log(`WebSocket server available at ws://localhost:${port}/api/trpc`);
});

// Cleanup
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down");
  wssHandler.broadcastReconnectNotification();
  wss.close();
  server.close();
});
