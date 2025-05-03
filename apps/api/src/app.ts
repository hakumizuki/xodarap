import { Request, Response, Router } from "express";
import { AppService } from "./app.service";

// Create router
export const appRouter = Router();

// Create service instance
const appService = new AppService();

// Define routes
appRouter.get("/", (_req: Request, res: Response) => {
  const result = appService.getHello();
  res.send(result);
});
