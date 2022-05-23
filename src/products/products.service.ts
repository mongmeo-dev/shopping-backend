import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './model/product.model';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { User } from '../users/model/user.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createProduct(userId: number, createProductData: CreateProductInput): Promise<Product> {
    await this.isAdmin(userId);

    return await this.productsRepository.save(createProductData);
  }

  async getAllProduct(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    return await this.getProductByIdOrThrow404(id);
  }

  async updateProductById(
    userId: number,
    id: number,
    updateProductData: UpdateProductInput,
  ): Promise<Product> {
    await this.isAdmin(userId);

    const product = await this.getProductByIdOrThrow404(id);
    return await this.productsRepository.save({ ...product, ...updateProductData });
  }

  async deleteProductById(userId: number, id: number): Promise<boolean> {
    await this.isAdmin(userId);

    await this.getProductByIdOrThrow404(id);
    await this.productsRepository.delete({ id });
    return true;
  }

  private async getProductByIdOrThrow404(id: number) {
    const product = await this.productsRepository.findOne({ id });
    if (!product) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }
    return product;
  }

  private async isAdmin(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (!user.isAdmin) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }
  }
}
