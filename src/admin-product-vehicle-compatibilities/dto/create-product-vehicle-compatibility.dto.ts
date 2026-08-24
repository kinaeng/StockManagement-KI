import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductVehicleCompatibilityDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  vehicleId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
