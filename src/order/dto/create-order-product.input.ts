import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@InputType()
export class CreateOrderProductInput {
  @Field(() => ID)
  productId: number;

  @IsPositive()
  @Field(() => Int)
  quantity: number;
}
