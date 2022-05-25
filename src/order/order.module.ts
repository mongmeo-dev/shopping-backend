import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './model/order.model';
import { User } from '../users/model/user.model';
import { Product } from '../products/model/product.model';
import { OrderResolver } from './order.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product])],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
