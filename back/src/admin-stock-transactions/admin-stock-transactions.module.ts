import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminStockTransactionsController } from './admin-stock-transactions.controller';
import { AdminStockTransactionsService } from './admin-stock-transactions.service';
import { StockTransaction } from './entities/stock-transaction.entity';
import { StockTransactionItem } from './entities/stock-transaction-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransaction, StockTransactionItem]),
  ],
  controllers: [AdminStockTransactionsController],
  providers: [AdminStockTransactionsService],
  exports: [AdminStockTransactionsService],
})
export class AdminStockTransactionsModule {}
