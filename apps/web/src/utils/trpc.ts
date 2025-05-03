import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../types/api";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
