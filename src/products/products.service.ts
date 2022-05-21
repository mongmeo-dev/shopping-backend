import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './model/product.model';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createProduct(createProductData: CreateProductInput): Promise<Product> {
    return await this.productsRepository.save(createProductData);
  }

  async getAllProduct(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    return await this.getProductByIdOrThrow404(id);
  }

  async updateProductById(id: number, updateProductData: UpdateProductInput): Promise<Product> {
    const product = await this.getProductByIdOrThrow404(id);
    return await this.productsRepository.save({ ...product, ...updateProductData });
  }

  async deleteProductById(id: number): Promise<boolean> {
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
}
