import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminStockAlertsController } from './admin-stock-alerts.controller';
import { AdminStockAlertsService } from './admin-stock-alerts.service';
import { StockAlert } from './entities/stock-alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockAlert])],
  controllers: [AdminStockAlertsController],
  providers: [AdminStockAlertsService],
  exports: [AdminStockAlertsService],
})
export class AdminStockAlertsModule {}
