import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  OVERSTOCK = 'OVERSTOCK',
}

export enum AlertStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
}

@Entity('stock_alerts')
export class StockAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({
    type: 'varchar',
    name: 'alert_type',
  })
  alertType: AlertType;

  @Column({ name: 'current_qty', default: 0 })
  currentQty: number;

  @Column({ name: 'threshold_qty', default: 0 })
  thresholdQty: number;

  @Column({
    type: 'varchar',
    default: AlertStatus.PENDING,
  })
  status: AlertStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
