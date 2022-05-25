import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/model/user.model';
import { OrderStatus } from '../enum/orderStatus';
import { OrderProduct } from './order-product.model';

@ObjectType()
@Entity('order_table')
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => String)
  @Column('varchar', { length: 100 })
  address: string;

  @Field(() => OrderStatus)
  @Column()
  status: OrderStatus;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [OrderProduct])
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products: OrderProduct[];
}
