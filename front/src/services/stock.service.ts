import { apiRequest } from './api-client';
import type { StockMovement } from '@/composables/use-stock';

export interface BackendStockTransactionItem {
  id?: number;
  productId: number;
  locationId?: number | null;
  quantity: number;
  unitCost?: number | string | null;
  product?: {
    id: number;
    sku: string;
    name: string;
  };
}

export interface BackendStockTransaction {
  id: number;
  transactionNumber: string;
  transactionType: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER';
  referenceType?: string | null;
  referenceId?: number | null;
  warehouseId: number;
  createdByUserId?: number | null;
  transactionDate?: string | null;
  createdAt?: string;
  items?: BackendStockTransactionItem[];
}

export interface BackendStockAdjustmentItem {
  id?: number;
  productId: number;
  systemQty: number;
  actualQty: number;
  product?: {
    id: number;
    sku: string;
    name: string;
  };
}

export interface BackendStockAdjustment {
  id: number;
  adjustmentNumber: string;
  reason?: string | null;
  status?: string | null;
  createdByUserId?: number | null;
  createdAt?: string;
  items?: BackendStockAdjustmentItem[];
}

export interface CreateStockTransactionInput {
  transactionNumber: string;
  transactionType: 'IN' | 'OUT' | 'ADJUST';
  warehouseId?: number;
  referenceType?: 'PO' | 'REQUISITION' | 'ADJUSTMENT';
  items: {
    productId: number;
    quantity: number;
    unitCost?: number;
  }[];
}

export interface CreateStockAdjustmentInput {
  adjustmentNumber: string;
  reason?: string;
  items: {
    productId: number;
    systemQty: number;
    actualQty: number;
  }[];
}

/**
 * แปลง StockTransaction จาก Backend เป็น StockMovement สำหรับ Frontend
 * @param tx ข้อมูล StockTransaction จาก Backend
 * @returns ข้อมูล StockMovement รายการแรกสำหรับแสดงในตารางประวัติ
 */
export function mapTransactionFromApi(tx: BackendStockTransaction): StockMovement[] {
  const dateStr = tx.createdAt ? tx.createdAt.replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16);
  
  if (!tx.items || tx.items.length === 0) {
    return [
      {
        id: tx.id,
        productId: 0,
        productName: 'รายการสต็อก',
        partNumber: '-',
        type: tx.transactionType === 'ADJUST' ? 'ADJUST' : tx.transactionType === 'OUT' ? 'OUT' : 'IN',
        quantity: 0,
        refDocument: tx.transactionNumber,
        createdBy: tx.createdByUserId ? `User #${tx.createdByUserId}` : 'เจ้าหน้าที่คลัง',
        createdAt: dateStr,
      },
    ];
  }

  return tx.items.map((item, idx) => ({
    id: Number(`${tx.id}${idx}`),
    productId: item.productId,
    productName: item.product?.name ?? `สินค้า #${item.productId}`,
    partNumber: item.product?.sku ?? '-',
    type: tx.transactionType === 'ADJUST' ? 'ADJUST' : tx.transactionType === 'OUT' ? 'OUT' : 'IN',
    quantity: item.quantity,
    refDocument: tx.transactionNumber,
    createdBy: tx.createdByUserId ? `User #${tx.createdByUserId}` : 'เจ้าหน้าที่คลัง',
    createdAt: dateStr,
  }));
}

/**
 * ดึงรายการเคลื่อนไหวสต็อกทั้งหมดจาก Backend API (GET /admin/stock-transactions)
 * @returns รายการ StockMovement ทั้งหมด
 */
export async function getStockMovements(): Promise<StockMovement[]> {
  const transactions = await apiRequest<BackendStockTransaction[]>('/admin/stock-transactions');
  const movements: StockMovement[] = [];
  transactions.forEach((tx) => {
    movements.push(...mapTransactionFromApi(tx));
  });
  return movements;
}

/**
 * สร้างรายการเคลื่อนไหวสต็อก (รับเข้า/จ่ายออก) ใน Backend API (POST /admin/stock-transactions)
 * @param input ข้อมูลสำหรับสร้าง Stock Transaction
 * @returns รายการ StockMovement ที่สร้างขึ้น
 */
export async function createStockTransaction(input: CreateStockTransactionInput): Promise<StockMovement[]> {
  const payload = {
    transactionNumber: input.transactionNumber,
    transactionType: input.transactionType,
    warehouseId: input.warehouseId ?? 1,
    ...(input.referenceType ? { referenceType: input.referenceType } : {}),
    items: input.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      ...(i.unitCost !== undefined ? { unitCost: i.unitCost } : {}),
    })),
  };

  const created = await apiRequest<BackendStockTransaction>('/admin/stock-transactions', {
    method: 'POST',
    body: payload,
  });

  return mapTransactionFromApi(created);
}

/**
 * สร้างรายการปรับปรุงยอดสต็อก (Stock Adjustment) ใน Backend API (POST /admin/stock-adjustments)
 * @param input ข้อมูลสำหรับสร้าง Stock Adjustment
 * @returns ผลลัพธ์การสร้าง Adjustment จาก Backend API
 */
export async function createStockAdjustment(input: CreateStockAdjustmentInput): Promise<BackendStockAdjustment> {
  const payload = {
    adjustmentNumber: input.adjustmentNumber,
    reason: input.reason ?? 'ปรับปรุงยอดนับจริง',
    status: 'APPROVED',
    items: input.items,
  };

  return await apiRequest<BackendStockAdjustment>('/admin/stock-adjustments', {
    method: 'POST',
    body: payload,
  });
}
