import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from '../../users/dto/create-user.input';

@InputType()
export class LoginInput extends PickType(CreateUserInput, ['email', 'password'] as const) {}
