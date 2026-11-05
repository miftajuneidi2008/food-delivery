import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GatewayModule } from '../gateway/gateway.module';
import { OrdersService } from './order.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [AuthModule, GatewayModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
