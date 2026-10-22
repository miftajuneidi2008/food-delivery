import { JwtPayload, UserRole } from '@food-delivery/types';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { UTApi } from 'uploadthing/server';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

type AuthRequest = ExpressRequest & { user: JwtPayload };

// Minimal shape of the file Multer provides (avoids relying on the global Express.Multer type)
type UploadedImage = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  create(@Request() req: AuthRequest, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(req.user.sub, dto);
  }

  @Post('upload-image')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 4 * 1024 * 1024 },
      fileFilter: (_req, file, cb) =>
        cb(null, file.mimetype.startsWith('image/')),
    }),
  )
  async uploadImage(@UploadedFile() file?: UploadedImage) {
    if (!file) throw new BadRequestException('An image file is required');
    const res = await utapi.uploadFiles(
      new File([new Uint8Array(file.buffer)], file.originalname, {
        type: file.mimetype,
      }),
    );
    if (res.error) throw new BadRequestException(res.error.message);
    return { url: res.data.ufsUrl };
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  findMine(@Request() req: AuthRequest) {
    return this.restaurantsService.findMine(req.user.sub);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    // @Query('search') extracts ?search= from the URL — optional
    return this.restaurantsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  update(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, req.user.sub, dto);
  }
}
