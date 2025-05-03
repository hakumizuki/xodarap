import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Response } from "express";
import type { IncomingMessage } from "node:http";

// Type for our context
export interface Context {
  req?: unknown;
  res?: Response | unknown;
}

// Create context for HTTP requests
export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => ({
  req,
  res,
});

// Create context for WebSocket connections
export const createWSContext = ({
  req,
}: { req: IncomingMessage }): Context => ({
  req,
});

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
