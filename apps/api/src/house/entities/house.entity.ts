import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class House {
  @Field(() => Int, { description: "Example field (placeholder)" })
  exampleField: number;
}
