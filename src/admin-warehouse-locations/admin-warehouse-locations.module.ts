import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminWarehouseLocationsController } from './admin-warehouse-locations.controller';
import { AdminWarehouseLocationsService } from './admin-warehouse-locations.service';
import { WarehouseLocation } from './entities/warehouse-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseLocation])],
  controllers: [AdminWarehouseLocationsController],
  providers: [AdminWarehouseLocationsService],
  exports: [AdminWarehouseLocationsService],
})
export class AdminWarehouseLocationsModule {}
