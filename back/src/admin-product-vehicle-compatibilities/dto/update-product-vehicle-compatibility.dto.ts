import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVehicleCompatibilityDto } from './create-product-vehicle-compatibility.dto';

export class UpdateProductVehicleCompatibilityDto extends PartialType(
  CreateProductVehicleCompatibilityDto,
) {}
