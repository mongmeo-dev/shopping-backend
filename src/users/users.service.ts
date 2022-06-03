import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async join(createUserData: CreateUserInput): Promise<User> {
    const { email, password, phone } = createUserData;
    const normalizedPhoneNumber = this.normalizePhoneNumber(phone);

    await this.checkOverlap(email, normalizedPhoneNumber);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.usersRepository.create({
      ...createUserData,
      password: hashedPassword,
      phone: normalizedPhoneNumber,
    });
    return await this.usersRepository.save(newUser);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return user;
  }

  async getUserById(id: number): Promise<User> {
    return await this.getUserByIdOrThrow404(id);
  }

  async updateUserById(id: number, updateUserData: UpdateUserInput): Promise<User> {
    const user = await this.getUserByIdOrThrow404(id);
    const { email, phone } = updateUserData;

    if (email || phone) {
      await this.checkOverlap(updateUserData.email, updateUserData.phone);
    }
    return await this.usersRepository.save({ ...user, ...updateUserData });
  }

  async deleteUserById(id: number): Promise<void> {
    await this.getUserByIdOrThrow404(id);
    await this.usersRepository.delete({ id });
  }

  private async getUserByIdOrThrow404(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return user;
  }

  private async checkOverlap(email: string, phone: string): Promise<void> {
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

  private normalizePhoneNumber(phone: string): string {
    if (phone.includes('-')) {
      return phone.replace('-', '');
    }
    return phone;
  }
}
