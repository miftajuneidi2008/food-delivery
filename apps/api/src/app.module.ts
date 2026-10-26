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
import { RestaurantsController } from './restaurants/restaurants.controller';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsService } from './restaurants/restaurants.service';
import { OrderService } from './orders/order.service';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    RestaurantsModule,
    MenuModule,
  ],
  controllers: [
    AppController,
    AuthController,
    RestaurantsController,
    MenuController,
    OrdersController,
  ],
  providers: [AppService, AuthService, RestaurantsService, MenuService, OrderService],
})
export class AppModule {}
