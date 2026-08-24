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
  const suppliers = ref<Supplier[]>([
    {
      id: 1,
      code: 'SUP-001',
      name: 'บริษัท ฮอนด้า ออโตโมบิล (ประเทศไทย) จำกัด',
      contactPerson: 'คุณสมชาย',
      phone: '02-111-2222',
      email: 'sales@honda.co.th',
    },
    {
      id: 2,
      code: 'SUP-002',
      name: 'บริษัท ยามาฮ่ามอเตอร์ (ประเทศไทย) จำกัด',
      contactPerson: 'คุณวิภา',
      phone: '02-333-4444',
      email: 'contact@yamaha.co.th',
    },
    {
      id: 3,
      code: 'SUP-003',
      name: 'นิสชิน เบรค ประเทศไทย',
      contactPerson: 'คุณมานพ',
      phone: '038-555-666',
      email: 'info@nissin.co.th',
    },
  ]);

  const purchaseOrders = ref<PurchaseOrder[]>([
    {
      id: 1,
      poNumber: 'PO-2026-001',
      supplierName: 'บริษัท ฮอนด้า ออโตโมบิล (ประเทศไทย) จำกัด',
      items: [
        {
          id: 101,
          partNumber: 'HON-14401-KWW-600',
          productName: 'โซ่ราวลิ้น 90 ข้อ (Wave 110i / CZ-i)',
          quantity: 20,
          unitPrice: 120,
          totalPrice: 2400,
        },
        {
          id: 102,
          partNumber: 'HON-31916-KRM-841',
          productName: 'หัวเทียน CPR6EA-9 (Wave 110i / Scoopy i / Click 125i)',
          quantity: 50,
          unitPrice: 55,
          totalPrice: 2750,
        },
        {
          id: 103,
          partNumber: 'HON-51490-KRM-852',
          productName: 'ชุดซีลโช้คหน้าพร้อมซีลกันฝุ่น (Wave / PCX 150)',
          quantity: 30,
          unitPrice: 130,
          totalPrice: 3900,
        },
      ],
      totalAmount: 9050,
      status: 'RECEIVED',
      createdAt: '2026-07-15',
      note: 'จัดส่งรอบปกติประจำเดือน ก.ค.',
    },
    {
      id: 2,
      poNumber: 'PO-2026-002',
      supplierName: 'บริษัท ยามาฮ่ามอเตอร์ (ประเทศไทย) จำกัด',
      items: [
        {
          id: 201,
          partNumber: 'YAM-5YP-E4450-00',
          productName: 'ไส้กรองอากาศ (Spark 135 / Exciter 150)',
          quantity: 40,
          unitPrice: 85,
          totalPrice: 3400,
        },
        {
          id: 202,
          partNumber: 'YAM-2DP-E7641-00',
          productName: 'สายพานขับเคลื่อน (NMAX 155 / AEROX 155)',
          quantity: 15,
          unitPrice: 320,
          totalPrice: 4800,
        },
      ],
      totalAmount: 8200,
      status: 'ORDERED',
      createdAt: '2026-07-20',
      note: 'สั่งซื้อเติมสต็อกฉุกเฉิน',
    },
  ]);

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
