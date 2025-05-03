import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SampleService } from "./sample.service";

// Create service instance
const sampleService = new SampleService();

// Define input schema using zod
const sampleInputSchema = z.object({
  id: z.string(),
});

export const sampleRouter = router({
  sample: publicProcedure
    .input(sampleInputSchema)
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new Error("id is required");
      }

      return sampleService.execute();
    }),
});
