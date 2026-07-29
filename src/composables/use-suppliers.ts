import { ref } from 'vue';

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdAt: string;
}

export function useSuppliers() {
  const suppliers = ref<Supplier[]>([
    { id: 1, code: 'SUP-001', name: 'บริษัท ฮอนด้า ออโตโมบิล (ประเทศไทย) จำกัด', contactPerson: 'คุณสมชาย', phone: '02-111-2222', email: 'sales@honda.co.th' },
    { id: 2, code: 'SUP-002', name: 'บริษัท ยามาฮ่ามอเตอร์ (ประเทศไทย) จำกัด', contactPerson: 'คุณวิภา', phone: '02-333-4444', email: 'contact@yamaha.co.th' },
    { id: 3, code: 'SUP-003', name: 'นิสชิน เบรค ประเทศไทย', contactPerson: 'คุณมานพ', phone: '038-555-666', email: 'info@nissin.co.th' },
  ]);

  const purchaseOrders = ref<PurchaseOrder[]>([
    { id: 1, poNumber: 'PO-2026-001', supplierName: 'บริษัท ฮอนด้า ออโตโมบิล (ประเทศไทย) จำกัด', totalAmount: 12500, status: 'RECEIVED', createdAt: '2026-07-15' },
    { id: 2, poNumber: 'PO-2026-002', supplierName: 'นิสชิน เบรค ประเทศไทย', totalAmount: 8400, status: 'ORDERED', createdAt: '2026-07-20' },
  ]);

  const addSupplier = (supplier: Omit<Supplier, 'id'>): void => {
    const id = suppliers.value.length > 0 ? Math.max(...suppliers.value.map((s) => s.id)) + 1 : 1;
    suppliers.value.push({ ...supplier, id });
  };

  const addPO = (po: Omit<PurchaseOrder, 'id' | 'createdAt'>): void => {
    const id = purchaseOrders.value.length > 0 ? Math.max(...purchaseOrders.value.map((p) => p.id)) + 1 : 1;
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
