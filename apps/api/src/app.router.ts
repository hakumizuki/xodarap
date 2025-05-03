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
  helloHttpStream: publicProcedure.query(async function* ({ ctx }) {
    // Get the response object from context
    const { res } = ctx;

    // Set headers for streaming if we have a response object with setHeader method
    if (res && typeof res === "object" && "setHeader" in res) {
      const expressRes = res as {
        setHeader: (name: string, value: string) => void;
      };
      expressRes.setHeader("Content-Type", "text/plain");
      expressRes.setHeader("Transfer-Encoding", "chunked");
      expressRes.setHeader("Cache-Control", "no-cache");
      expressRes.setHeader("Connection", "keep-alive");
    }

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
