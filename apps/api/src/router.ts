import { appRouter as appRoutes } from "./app.router";
import { sampleRouter as sampleRoutes } from "./sample/sample.router";
import { router } from "./trpc";

export const appRouter = router({
  app: appRoutes,
  sample: sampleRoutes,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
