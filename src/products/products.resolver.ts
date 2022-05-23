import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from './model/product.model';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UpdateProductInput } from './dto/update-product.input';
import { CurrentUserId } from '../common/decorators/current-user.decorator';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async createProduct(
    @CurrentUserId() userId: number,
    @Args({ name: 'createProductData', type: () => CreateProductInput })
    createProductData: CreateProductInput,
  ): Promise<Product> {
    return await this.productsService.createProduct(userId, createProductData);
  }

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await this.productsService.getAllProduct();
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async updateProduct(
    @CurrentUserId() userId: number,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'updateProductData', type: () => UpdateProductInput })
    updateProductData: UpdateProductInput,
  ): Promise<Product> {
    return await this.productsService.updateProductById(userId, id, updateProductData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteProduct(
    @CurrentUserId() userId: number,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.productsService.deleteProductById(userId, id);
  }
}
