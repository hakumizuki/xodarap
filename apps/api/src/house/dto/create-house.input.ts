import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateHouseInput {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;
}
