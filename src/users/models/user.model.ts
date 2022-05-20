import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Field()
  @Column('char', { length: 60 })
  password: string;

  @Field()
  @Column('varchar', { length: 10 })
  name: string;

  @Field()
  @Column('varchar', { length: 15, unique: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ default: false })
  isAdmin: boolean;
}
