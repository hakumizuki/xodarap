import dotenv from "dotenv";
import express from "express";
import { appRouter } from "./app";
import { sampleRouter } from "./sample/sample.router";

// Load environment variables
dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT as string) || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", appRouter);
app.use("/sample", sampleRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
