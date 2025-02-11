import {} from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SampleController } from "./sample/sample.controller";
import { SampleService } from "./sample/sample.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, SampleController],
  providers: [AppService, SampleService],
})
export class AppModule {}
