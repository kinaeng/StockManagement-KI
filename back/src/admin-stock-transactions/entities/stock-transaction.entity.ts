import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockTransactionItem } from './stock-transaction-item.entity';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUST = 'ADJUST',
  TRANSFER = 'TRANSFER',
}

export enum ReferenceType {
  PO = 'PO',
  REQUISITION = 'REQUISITION',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('stock_transactions')
export class StockTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_number', unique: true })
  transactionNumber: string;

  @Column({
    type: 'varchar',
    name: 'transaction_type',
  })
  transactionType: TransactionType;

  @Column({
    type: 'varchar',
    name: 'reference_type',
    nullable: true,
  })
  referenceType: ReferenceType;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'created_by_user_id', nullable: true })
  createdByUserId: number;

  @Column({ name: 'transaction_date', nullable: true })
  transactionDate: string;

  @OneToMany(() => StockTransactionItem, (item) => item.stockTransaction, {
    cascade: true,
  })
  items: StockTransactionItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
