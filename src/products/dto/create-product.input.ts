import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  stock: number;

  @Field()
  detail: string;

  @Field({ nullable: true })
  mainImg: string;
}
