import { Field, InputType } from '@nestjs/graphql';
import { CreateOrderProductInput } from './create-order-product.input';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderProductInput])
  products: CreateOrderProductInput[];

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  address: string;
}
