import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CurrentUserId } from '../common/decorator/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateUserInput } from '../auth/dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args({ name: 'createUserData' }) createUserData: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.join(createUserData);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async loggedInUser(@CurrentUserId() id: number): Promise<User> {
    return await this.usersService.getUserById(id);
  }
}
