import { Request, Response, Router } from "express";
import { SampleDto } from "./dto/SampleDto";
import { SampleService } from "./sample.service";

// Create router
export const sampleRouter = Router();

// Create service instance
const sampleService = new SampleService();

// Define routes
sampleRouter.post("/sample", async (req: Request, res: Response) => {
  try {
    const body = req.body as SampleDto;

    if (!body.id) {
      return res.status(400).json({ message: "id is required" });
    }

    const result = await sampleService.execute();
    return res.json(result);
  } catch (error) {
    console.error("Error in sample endpoint:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
