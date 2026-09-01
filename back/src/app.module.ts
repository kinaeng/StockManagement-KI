import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminCategoriesModule } from './admin-categories/admin-categories.module';
import { AdminProductsModule } from './admin-products/admin-products.module';
import { AdminVehiclesModule } from './admin-vehicles/admin-vehicles.module';
import { AdminProductVehicleCompatibilitiesModule } from './admin-product-vehicle-compatibilities/admin-product-vehicle-compatibilities.module';
import { AdminWarehousesModule } from './admin-warehouses/admin-warehouses.module';
import { AdminWarehouseLocationsModule } from './admin-warehouse-locations/admin-warehouse-locations.module';
import { AdminInventoriesModule } from './admin-inventories/admin-inventories.module';
import { AdminSuppliersModule } from './admin-suppliers/admin-suppliers.module';
import { AdminPurchaseOrdersModule } from './admin-purchase-orders/admin-purchase-orders.module';
import { AdminStockTransactionsModule } from './admin-stock-transactions/admin-stock-transactions.module';
import { AdminStockAdjustmentsModule } from './admin-stock-adjustments/admin-stock-adjustments.module';
import { AdminStockAlertsModule } from './admin-stock-alerts/admin-stock-alerts.module';
import { AdminAuditLogsModule } from './admin-audit-logs/admin-audit-logs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'kistockmanage'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    AdminUsersModule,
    AdminCategoriesModule,
    AdminProductsModule,
    AdminVehiclesModule,
    AdminProductVehicleCompatibilitiesModule,
    AdminWarehousesModule,
    AdminWarehouseLocationsModule,
    AdminInventoriesModule,
    AdminSuppliersModule,
    AdminPurchaseOrdersModule,
    AdminStockTransactionsModule,
    AdminStockAdjustmentsModule,
    AdminStockAlertsModule,
    AdminAuditLogsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
