import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateHouseInput } from "./create-house.input";

@InputType()
export class UpdateHouseInput extends PartialType(CreateHouseInput) {
  @Field(() => Int)
  id: number;
}
