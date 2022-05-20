import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from '../auth/dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async join(createUserData: CreateUserInput) {
    const { email, password, phone } = createUserData;
    await this.checkOverlap(email, phone);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.usersRepository.create({
      ...createUserData,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return user;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return user;
  }

  private async checkOverlap(email: string, phone: string) {
    let isExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (isExist) {
      throw new BadRequestException('이 이메일은 이미 사용중입니다.');
    }

    isExist = await this.usersRepository.findOne({
      where: { phone },
    });
    if (isExist) {
      throw new BadRequestException('이 전화번호는 이미 사용중입니다.');
    }
  }
}
