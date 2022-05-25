import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsPositive()
  @Field(() => Int)
  price: number;

  @IsPositive()
  @IsNotEmpty()
  @Field(() => Int)
  stock: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  detail: string;

  @Field(() => String, { nullable: true })
  mainImg: string;
}
