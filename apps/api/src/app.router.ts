import { AppService } from "./app.service";
import { publicProcedure, router } from "./trpc";

// Create service instance
const appService = new AppService();

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return appService.getHello();
  }),

  // WebSocket-based streaming using subscription
  helloStream: publicProcedure.subscription(() => {
    return appService.getHelloStream();
  }),

  // HTTP-based streaming using query
  helloHttpStream: publicProcedure.query(async function* () {
    // For HTTP streaming, we'll just return the full string
    // The client will simulate streaming by processing it character by character
    const words = appService.getStreamWords();
    for (const word of words) {
      yield word;
      // Simulate a delay between words
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }),
});
