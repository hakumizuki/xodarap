import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { SampleDto } from "./dto/SampleDto";
import { SampleService } from "./sample.service";

@Controller("sample")
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post("sample")
  async sample(@Body() body: SampleDto) {
    if (!body.id) {
      throw new HttpException("id is required", 400);
    }

    return this.sampleService.execute();
  }
}
