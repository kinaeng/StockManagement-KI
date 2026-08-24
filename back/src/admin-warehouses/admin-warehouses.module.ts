import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminWarehousesController } from './admin-warehouses.controller';
import { AdminWarehousesService } from './admin-warehouses.service';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  controllers: [AdminWarehousesController],
  providers: [AdminWarehousesService],
  exports: [AdminWarehousesService],
})
export class AdminWarehousesModule {}
