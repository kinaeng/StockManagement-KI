import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockAdjustmentItem } from './stock-adjustment-item.entity';

export enum AdjustmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('stock_adjustments')
export class StockAdjustment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'adjustment_number', unique: true })
  adjustmentNumber: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({
    type: 'varchar',
    default: AdjustmentStatus.PENDING,
  })
  status: AdjustmentStatus;

  @Column({ name: 'created_by_user_id', nullable: true })
  createdByUserId: number;

  @Column({ name: 'approved_by_user_id', nullable: true })
  approvedByUserId: number;

  @OneToMany(() => StockAdjustmentItem, (item) => item.stockAdjustment, {
    cascade: true,
  })
  items: StockAdjustmentItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
