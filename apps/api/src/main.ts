import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { appRouter } from "./router";
import { createContext } from "./trpc";

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`tRPC API available at http://localhost:${port}/api/trpc`);
});
