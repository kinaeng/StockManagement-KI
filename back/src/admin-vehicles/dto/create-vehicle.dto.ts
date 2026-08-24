import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  yearStart: number;

  @IsInt()
  @IsOptional()
  yearEnd?: number;

  @IsString()
  @IsOptional()
  engineCode?: string;
}
