import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateMenuItemDto {
  @IsUUID()
  @IsOptional()
  categoryId!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString() // price comes as a string e.g. "8.99" — matches numeric DB type
  @IsOptional()
  price!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string; // set after UploadThing upload
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
