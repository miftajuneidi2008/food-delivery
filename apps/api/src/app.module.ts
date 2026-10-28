import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { DbModule } from './db/db.module';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { MenuService } from './menu/menu.service';
import { OrdersService } from './orders/order.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsController } from './restaurants/restaurants.controller';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsService } from './restaurants/restaurants.service';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';

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
  ],
})
export class AppModule {}
