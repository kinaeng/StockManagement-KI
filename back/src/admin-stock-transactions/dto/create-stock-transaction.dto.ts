import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TransactionType,
  ReferenceType,
} from '../entities/stock-transaction.entity';

export class CreateStockTransactionItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsOptional()
  locationId?: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  @IsOptional()
  unitCost?: number;
}

export class CreateStockTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionNumber: string;

  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsEnum(ReferenceType)
  @IsOptional()
  referenceType?: ReferenceType;

  @IsInt()
  @IsOptional()
  referenceId?: number;

  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @IsInt()
  @IsOptional()
  createdByUserId?: number;

  @IsString()
  @IsOptional()
  transactionDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockTransactionItemDto)
  @IsOptional()
  items?: CreateStockTransactionItemDto[];
}
