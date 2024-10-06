import { Module } from "@nestjs/common";
import { HouseResolver } from "./house.resolver";
import { HouseService } from "./house.service";

@Module({
  providers: [HouseResolver, HouseService],
})
export class HouseModule {}
