import { Injectable } from "@nestjs/common";

@Injectable()
export class SampleService {
  async sample() {
    return {
      message: "Sample endpoint is working!",
      timestamp: new Date().toISOString(),
    };
  }
}
