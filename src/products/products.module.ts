import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './model/product.model';
import { ProductsResolver } from './products.resolver';
import { User } from '../users/model/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User])],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
