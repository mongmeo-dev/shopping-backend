import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Order } from './model/order.model';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { OrderStatus } from './enum/orderStatus';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async createOrder(
    @CurrentUserId() id: number,
    @Args({ name: 'createOrderData' }) createOrderData: CreateOrderInput,
  ): Promise<Order> {
    return await this.ordersService.createOrder(id, createOrderData);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Order])
  async allOrders(@CurrentUserId() id: number): Promise<Order[]> {
    return await this.ordersService.getAllOrder(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Order])
  async currentUserOrders(@CurrentUserId() id: number): Promise<Order[]> {
    return await this.ordersService.getCurrentUserOrders(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Order)
  async order(@CurrentUserId() userId: number, @Args('orderId') orderId: number): Promise<Order> {
    return await this.ordersService.getOrderById(userId, orderId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async updateOrderStatus(
    @CurrentUserId() userId: number,
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('orderStatus', { type: () => OrderStatus }) orderStatus: OrderStatus,
  ): Promise<Order> {
    return await this.ordersService.updateOrderStateById(userId, orderId, orderStatus);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async cancelOrder(
    @CurrentUserId() userId: number,
    @Args('orderId', { type: () => Int }) orderId: number,
  ): Promise<Order> {
    return await this.ordersService.cancelOrderById(userId, orderId);
  }
}
