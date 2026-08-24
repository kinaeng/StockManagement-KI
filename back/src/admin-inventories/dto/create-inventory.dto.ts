import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;
}
