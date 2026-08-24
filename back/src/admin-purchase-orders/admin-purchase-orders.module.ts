import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPurchaseOrdersController } from './admin-purchase-orders.controller';
import { AdminPurchaseOrdersService } from './admin-purchase-orders.service';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderItem])],
  controllers: [AdminPurchaseOrdersController],
  providers: [AdminPurchaseOrdersService],
  exports: [AdminPurchaseOrdersService],
})
export class AdminPurchaseOrdersModule {}
