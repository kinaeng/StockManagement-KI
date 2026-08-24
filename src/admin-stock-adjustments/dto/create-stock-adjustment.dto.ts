import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdjustmentStatus } from '../entities/stock-adjustment.entity';

export class CreateStockAdjustmentItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  systemQty: number;

  @IsInt()
  actualQty: number;
}

export class CreateStockAdjustmentDto {
  @IsString()
  @IsNotEmpty()
  adjustmentNumber: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsEnum(AdjustmentStatus)
  @IsOptional()
  status?: AdjustmentStatus;

  @IsInt()
  @IsOptional()
  createdByUserId?: number;

  @IsInt()
  @IsOptional()
  approvedByUserId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockAdjustmentItemDto)
  @IsOptional()
  items?: CreateStockAdjustmentItemDto[];
}
