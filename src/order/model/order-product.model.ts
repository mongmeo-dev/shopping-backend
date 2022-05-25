import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/model/product.model';
import { Order } from './order.model';

@ObjectType()
@Entity()
export class OrderProduct {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => Order)
  @ManyToOne(() => Order)
  order: Order;
}
