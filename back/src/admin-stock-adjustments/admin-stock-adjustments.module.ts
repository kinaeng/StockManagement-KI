import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminStockAdjustmentsController } from './admin-stock-adjustments.controller';
import { AdminStockAdjustmentsService } from './admin-stock-adjustments.service';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { StockAdjustmentItem } from './entities/stock-adjustment-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockAdjustment, StockAdjustmentItem])],
  controllers: [AdminStockAdjustmentsController],
  providers: [AdminStockAdjustmentsService],
  exports: [AdminStockAdjustmentsService],
})
export class AdminStockAdjustmentsModule {}
