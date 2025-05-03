import { AppService } from "./app.service";
import { publicProcedure, router } from "./trpc";

// Create service instance
const appService = new AppService();

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return appService.getHello();
  }),
});
