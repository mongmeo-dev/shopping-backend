import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  order_complete,
  wait_shipping,
  shipping_complete,
  canceled,
}

registerEnumType(OrderStatus, { name: 'orderState' });
