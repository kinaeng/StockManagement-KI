import { ref } from 'vue';
import * as suppliersService from '@/services/suppliers.service';
import * as poService from '@/services/purchase-orders.service';

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  taxId?: string;
}

export interface POItem {
  id?: number;
  productId?: number;
  partNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId?: number;
  supplierName: string;
  items: POItem[];
  totalAmount: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdAt: string;
  note?: string;
}

/**
 * Composable สำหรับจัดการ State และ Logic ของผู้จำหน่าย (Suppliers) และใบสั่งซื้อ (Purchase Orders)
 */
export function useSuppliers() {
  const suppliers = ref<Supplier[]>([]);
  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * สร้าง Map จับคู่ระหว่าง ID ผู้จำหน่าย กับชื่อผู้จำหน่าย
   * @returns Map<id, name>
   */
  const getSupplierNameMap = (): Map<number, string> => {
    const map = new Map<number, string>();
    suppliers.value.forEach((s) => map.set(s.id, s.name));
    return map;
  };

  /**
   * โหลดรายการผู้จำหน่ายทั้งหมดจาก Backend API
   */
  const loadSuppliers = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      suppliers.value = await suppliersService.getSuppliers();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'โหลดข้อมูลผู้จำหน่ายไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * เพิ่มผู้จำหน่ายรายใหม่ไปยัง Backend API และอัปเดต State
   * @param supplier ข้อมูลผู้จำหน่ายใหม่
   */
  const addSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const created = await suppliersService.createSupplier(supplier);
      suppliers.value.unshift(created);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เพิ่มผู้จำหน่ายไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ลบผู้จำหน่ายจาก Backend API และอัปเดต State
   * @param id รหัส ID ของผู้จำหน่ายที่ต้องการลบ
   */
  const deleteSupplier = async (id: number): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      await suppliersService.deleteSupplier(id);
      suppliers.value = suppliers.value.filter((s) => s.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'ลบผู้จำหน่ายไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * โหลดรายการใบสั่งซื้อทั้งหมดจาก Backend API
   */
  const loadPurchaseOrders = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const nameMap = getSupplierNameMap();
      purchaseOrders.value = await poService.getPurchaseOrders(nameMap);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'โหลดข้อมูลใบสั่งซื้อไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * สร้างใบสั่งซื้อใหม่ไปยัง Backend API และอัปเดต State
   * @param input ข้อมูลใบสั่งซื้อที่จะสร้าง
   */
  const addPO = async (input: {
    poNumber: string;
    supplierId: number;
    status?: poService.POStatus;
    items: poService.CreatePOItemInput[];
    note?: string;
  }): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const nameMap = getSupplierNameMap();
      const created = await poService.createPurchaseOrder(
        {
          poNumber: input.poNumber,
          supplierId: input.supplierId,
          status: input.status ?? 'ORDERED',
          items: input.items,
        },
        nameMap,
      );
      if (input.note) {
        created.note = input.note;
      }
      purchaseOrders.value.unshift(created);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'สร้างใบสั่งซื้อไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * อัปเดตสถานะของใบสั่งซื้อไปยัง Backend API และอัปเดต State
   * @param id รหัส ID ของใบสั่งซื้อ
   * @param status สถานะใหม่ (เช่น 'RECEIVED', 'CANCELLED')
   */
  const updatePOStatus = async (id: number, status: PurchaseOrder['status']): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const nameMap = getSupplierNameMap();
      const updated = await poService.updatePurchaseOrder(id, { status }, nameMap);
      const index = purchaseOrders.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        purchaseOrders.value[index] = {
          ...purchaseOrders.value[index],
          ...updated,
        };
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'อัปเดตสถานะใบสั่งซื้อไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    suppliers,
    purchaseOrders,
    isLoading,
    error,
    loadSuppliers,
    addSupplier,
    deleteSupplier,
    loadPurchaseOrders,
    addPO,
    updatePOStatus,
  };
}
