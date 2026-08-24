import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseLocationDto {
  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @IsString()
  @IsNotEmpty()
  zone: string;

  @IsString()
  @IsNotEmpty()
  shelf: string;

  @IsString()
  @IsNotEmpty()
  bin: string;

  @IsString()
  @IsNotEmpty()
  locationCode: string;
}
