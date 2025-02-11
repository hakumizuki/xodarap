import { Controller, Post } from "@nestjs/common";
import { SampleService } from "./sample.service";

@Controller("sample")
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post()
  async sample() {
    return this.sampleService.sample();
  }
}
