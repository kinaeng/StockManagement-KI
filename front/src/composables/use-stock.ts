import { ref } from 'vue';
import * as stockService from '@/services/stock.service';

export type MovementType = 'IN' | 'OUT' | 'ADJUST';

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  partNumber: string;
  type: MovementType;
  quantity: number;
  refDocument: string;
  note?: string;
  createdBy: string;
  createdAt: string;
}

/**
 * Composable สำหรับจัดการ State และ Logic ของการเคลื่อนไหวสต็อกและการปรับปรุงยอดสินค้า
 */
export function useStock() {
  const stockMovements = ref<StockMovement[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * โหลดรายการประวัติการเคลื่อนไหวสต็อกทั้งหมดจาก Backend API
   */
  const loadStockMovements = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      stockMovements.value = await stockService.getStockMovements();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'โหลดประวัติสต็อกไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * บันทึกรายการรับเข้า/จ่ายออกสต็อก ไปยัง Backend API และอัปเดต State
   * @param input ข้อมูลการทำรายการรับเข้าหรือจ่ายออก
   */
  const recordTransaction = async (input: {
    transactionNumber: string;
    transactionType: 'IN' | 'OUT' | 'ADJUST';
    productId: number;
    quantity: number;
    unitCost?: number;
    note?: string;
  }): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const itemInput: { productId: number; quantity: number; unitCost?: number } = {
        productId: input.productId,
        quantity: input.quantity,
      };
      if (input.unitCost !== undefined) {
        itemInput.unitCost = input.unitCost;
      }

      const createdMovements = await stockService.createStockTransaction({
        transactionNumber: input.transactionNumber,
        transactionType: input.transactionType,
        items: [itemInput],
      });
      if (input.note && createdMovements[0]) {
        createdMovements[0].note = input.note;
      }
      stockMovements.value.unshift(...createdMovements);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'บันทึกรายการสต็อกไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * บันทึกรายการปรับปรุงยอดสต็อก (Stock Adjustment) ไปยัง Backend API
   * @param input ข้อมูลปรับปรุงยอดสต็อก
   */
  const recordAdjustment = async (input: {
    adjustmentNumber: string;
    reason?: string;
    productId: number;
    systemQty: number;
    actualQty: number;
  }): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const adjInput: stockService.CreateStockAdjustmentInput = {
        adjustmentNumber: input.adjustmentNumber,
        items: [
          {
            productId: input.productId,
            systemQty: input.systemQty,
            actualQty: input.actualQty,
          },
        ],
      };
      if (input.reason !== undefined) {
        adjInput.reason = input.reason;
      }

      await stockService.createStockAdjustment(adjInput);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'ปรับปรุงยอดสต็อกไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    stockMovements,
    isLoading,
    error,
    loadStockMovements,
    recordTransaction,
    recordAdjustment,
  };
}
