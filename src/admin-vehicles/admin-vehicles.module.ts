import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminVehiclesController } from './admin-vehicles.controller';
import { AdminVehiclesService } from './admin-vehicles.service';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [AdminVehiclesController],
  providers: [AdminVehiclesService],
  exports: [AdminVehiclesService],
})
export class AdminVehiclesModule {}
