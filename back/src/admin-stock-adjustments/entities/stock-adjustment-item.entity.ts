import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockAdjustment } from './stock-adjustment.entity';

@Entity('stock_adjustment_items')
export class StockAdjustmentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_adjustment_id' })
  stockAdjustmentId: number;

  @ManyToOne(() => StockAdjustment, (sa) => sa.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_adjustment_id' })
  stockAdjustment: StockAdjustment;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'system_qty', default: 0 })
  systemQty: number;

  @Column({ name: 'actual_qty', default: 0 })
  actualQty: number;

  @Column({ name: 'diff_qty', default: 0 })
  diffQty: number;
}
