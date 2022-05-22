import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './model/user.model';
import { UsersService } from './users.service';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

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

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateLoggedInUser(
    @CurrentUserId() id: number,
    @Args({ name: 'updateUserData' }) updateUserData: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.updateUserById(id, updateUserData);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteLoggedInUser(@CurrentUserId() id: number): Promise<boolean> {
    await this.usersService.deleteUserById(id);
    return true;
  }
}
