import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminInventoriesController } from './admin-inventories.controller';
import { AdminInventoriesService } from './admin-inventories.service';
import { Inventory } from './entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [AdminInventoriesController],
  providers: [AdminInventoriesService],
  exports: [AdminInventoriesService],
})
export class AdminInventoriesModule {}
