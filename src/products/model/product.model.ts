import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column('varchar', { length: 100 })
  name: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => Int)
  @Column()
  stock: number;

  @Field(() => String)
  @Column('text', { nullable: true })
  detail: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { name: 'main_img', length: 100, nullable: true })
  mainImg: string;
}
