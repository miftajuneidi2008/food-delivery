import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { DbModule } from './db/db.module';
import { GatewayModule } from './gateway/gateway.module';
import { OrdersGateway } from './gateway/orders.gateway';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { MenuService } from './menu/menu.service';
import { OrdersService } from './orders/order.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsService } from './payments/payments.service';
import { RestaurantsController } from './restaurants/restaurants.controller';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsService } from './restaurants/restaurants.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    RestaurantsModule,
    MenuModule,
    OrdersModule,
    PaymentsModule,
    GatewayModule,
  ],
  controllers: [
    AppController,
    AuthController,
    RestaurantsController,
    MenuController,
    OrdersController,
    PaymentsController,
  ],
  providers: [
    AppService,
    AuthService,
    RestaurantsService,
    MenuService,
    OrdersService,
    PaymentsService,
    OrdersGateway,
  ],
})
export class AppModule {}
