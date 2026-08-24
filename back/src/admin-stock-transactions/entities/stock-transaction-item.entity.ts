import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockTransaction } from './stock-transaction.entity';

@Entity('stock_transaction_items')
export class StockTransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_transaction_id' })
  stockTransactionId: number;

  @ManyToOne(() => StockTransaction, (st) => st.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_transaction_id' })
  stockTransaction: StockTransaction;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 10, scale: 2, default: 0 })
  unitCost: number;
}
