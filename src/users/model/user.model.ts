import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Field(() => String)
  @Column('char', { length: 60 })
  password: string;

  @Field(() => String)
  @Column('varchar', { length: 10 })
  name: string;

  @Field(() => String)
  @Column('varchar', { length: 15, unique: true })
  phone: string;

  @Field(() => Boolean)
  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;
}
