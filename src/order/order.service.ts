import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './model/order.model';
import { EntityManager, getManager, Repository } from 'typeorm';
import { OrderProduct } from './model/order-product.model';
import { User } from '../users/model/user.model';
import { Product } from '../products/model/product.model';
import { CreateOrderInput } from './dto/create-order.input';
import { CreateOrderProductInput } from './dto/create-order-product.input';
import { OrderStatus } from './enum/orderStatus';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  private orderQuery = this.ordersRepository
    .createQueryBuilder('order')
    .innerJoinAndSelect('order.user', 'user')
    .innerJoinAndSelect('order.products', 'order_product')
    .innerJoinAndSelect('order_product.product', 'product');

  async createOrder(userId: number, createOrderData: CreateOrderInput): Promise<Order> {
    await this.checkStock(createOrderData.products);

    // 주문 생성, 재고 감소
    const newOrder = await getManager().transaction(async (entityManager) => {
      const newOrder = await this.createOrderEntity(entityManager, userId, createOrderData);
      await this.createOrderProductEntity(entityManager, newOrder, createOrderData.products);
      await this.decreaseStock(entityManager, createOrderData.products);

      return newOrder;
    });

    return await this.orderQuery.where('order.id = :id', { id: newOrder.id }).getOne();
  }

  async getAllOrder(userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user.isAdmin) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }

    return await this.orderQuery.getMany();
  }

  async getCurrentUserOrders(userId: number): Promise<Order[]> {
    return await this.orderQuery.where('order.user = :id', { id: userId }).getMany();
  }

  async getOrderById(userId: number, orderId: number): Promise<Order> {
    const user = await this.usersRepository.findOne({ id: userId });
    const order = await this.orderQuery.where('order.id = :id', { id: orderId }).getOne();

    // 어드민이 아니라면 본인의 주문만 조회할 수 있음.
    if (!user.isAdmin) {
      this.checkOwner(user, order);
    }

    return order;
  }

  async updateOrderStateById(userId: number, orderId: number, status: OrderStatus) {
    const user = await this.usersRepository.findOne({ id: userId });

    if (!user.isAdmin) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }

    const order = await this.orderQuery.where('order.id = :id', { id: orderId }).getOne();

    order.status = status;

    return await this.ordersRepository.save(order);
  }

  async cancelOrderById(userId: number, orderId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    const order = await this.orderQuery.where('order.id = :id', { id: orderId }).getOne();

    // 어드민이 아니라면 본인의 주문만 취소할 수 있음.
    if (!user.isAdmin) {
      this.checkOwner(user, order);
    }

    const canceledOrder = await getManager().transaction(async (entityManager) => {
      await this.increaseStock(entityManager, order.products);
      order.status = OrderStatus.canceled;
      return await entityManager.save(order);
    });

    return canceledOrder;
  }

  private async checkStock(orderProducts: CreateOrderProductInput[]) {
    for (const orderProduct of orderProducts) {
      const foundProduct = await this.productsRepository.findOne({ id: orderProduct.productId });
      if (foundProduct.stock <= orderProduct.quantity) {
        throw new BadRequestException('재고가 부족한 제품이 있습니다.');
      }
    }
  }

  private async createOrderEntity(
    entityManager: EntityManager,
    userId: number,
    createOrderData: CreateOrderInput,
  ): Promise<Order> {
    const user = await entityManager.findOne(User, userId);
    const newOrder = new Order();
    newOrder.user = user;
    newOrder.address = createOrderData.address;
    newOrder.status = OrderStatus.order_complete;

    return await entityManager.save(newOrder);
  }

  private async createOrderProductEntity(
    entityManager: EntityManager,
    order: Order,
    orderProducts: CreateOrderProductInput[],
  ): Promise<void> {
    for (const orderProduct of orderProducts) {
      const foundProduct = await entityManager.findOne(Product, orderProduct.productId);
      const newOrderProduct = new OrderProduct();
      newOrderProduct.product = foundProduct;
      newOrderProduct.quantity = orderProduct.quantity;
      newOrderProduct.order = order;

      await entityManager.save(newOrderProduct);
    }
  }

  private async decreaseStock(
    entityManager: EntityManager,
    orderProducts: CreateOrderProductInput[],
  ): Promise<void> {
    for (const orderProduct of orderProducts) {
      const foundProduct = await entityManager.findOne(Product, orderProduct.productId);
      foundProduct.stock -= orderProduct.quantity;
      await entityManager.save(foundProduct);
    }
  }

  private async increaseStock(
    entityManager: EntityManager,
    orderProducts: OrderProduct[],
  ): Promise<void> {
    for (const orderProduct of orderProducts) {
      const foundProduct = await entityManager.findOne(Product, orderProduct.product.id);
      foundProduct.stock += orderProduct.quantity;
      await entityManager.save(foundProduct);
    }
  }

  private checkOwner(user: User, order: Order) {
    if (order.user.id !== user.id) {
      throw new ForbiddenException('본인의 주문만 접근할 수 있습니다.');
    }
  }
}
