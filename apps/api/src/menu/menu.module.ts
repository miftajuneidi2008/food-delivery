import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [JwtModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
