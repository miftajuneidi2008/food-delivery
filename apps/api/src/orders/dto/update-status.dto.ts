import { OrderStatus } from '@food-delivery/types';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
