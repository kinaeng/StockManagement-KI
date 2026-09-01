import { ref } from 'vue';

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface POItem {
  id: number;
  partNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierName: string;
  items: POItem[];
  totalAmount: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdAt: string;
  note?: string;
}

export function useSuppliers() {
  const suppliers = ref<Supplier[]>([]);

  const purchaseOrders = ref<PurchaseOrder[]>([]);

  const addSupplier = (supplier: Omit<Supplier, 'id'>): void => {
    const id = suppliers.value.length > 0 ? Math.max(...suppliers.value.map((s) => s.id)) + 1 : 1;
    suppliers.value.push({ ...supplier, id });
  };

  const addPO = (po: Omit<PurchaseOrder, 'id' | 'createdAt'>): void => {
    const id =
      purchaseOrders.value.length > 0 ? Math.max(...purchaseOrders.value.map((p) => p.id)) + 1 : 1;
    const today = new Date().toISOString().substring(0, 10);
    purchaseOrders.value.unshift({ ...po, id, createdAt: today });
  };

  const updatePOStatus = (id: number, status: PurchaseOrder['status']): void => {
    const po = purchaseOrders.value.find((p) => p.id === id);
    if (po) {
      po.status = status;
    }
  };

  return {
    suppliers,
    purchaseOrders,
    addSupplier,
    addPO,
    updatePOStatus,
  };
}
