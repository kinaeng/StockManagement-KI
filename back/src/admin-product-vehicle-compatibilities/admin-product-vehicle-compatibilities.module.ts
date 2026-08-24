import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProductVehicleCompatibilitiesController } from './admin-product-vehicle-compatibilities.controller';
import { AdminProductVehicleCompatibilitiesService } from './admin-product-vehicle-compatibilities.service';
import { ProductVehicleCompatibility } from './entities/product-vehicle-compatibility.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVehicleCompatibility])],
  controllers: [AdminProductVehicleCompatibilitiesController],
  providers: [AdminProductVehicleCompatibilitiesService],
  exports: [AdminProductVehicleCompatibilitiesService],
})
export class AdminProductVehicleCompatibilitiesModule {}
