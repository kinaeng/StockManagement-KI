import { ref } from 'vue';

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

export function useStock() {
  const stockMovements = ref<StockMovement[]>([
    {
      id: 1,
      productId: 1,
      productName: 'โซ่ราวลิ้น 90 ข้อ (Wave 110i / CZ-i)',
      partNumber: 'HON-14401-KWW-600',
      type: 'IN',
      quantity: 50,
      refDocument: 'PO-2026-001',
      note: 'รับเข้าจากบริษัท ฮอนด้า ล็อตใหม่',
      createdBy: 'พนักงานคลังสินค้า',
      createdAt: '2026-07-20 10:30',
    },
    {
      id: 2,
      productId: 1,
      productName: 'โซ่ราวลิ้น 90 ข้อ (Wave 110i / CZ-i)',
      partNumber: 'HON-14401-KWW-600',
      type: 'OUT',
      quantity: 48,
      refDocument: 'SO-2026-089',
      note: 'ตัดขายหน้าร้าน',
      createdBy: 'พนักงานขาย',
      createdAt: '2026-07-21 14:15',
    },
    {
      id: 3,
      productId: 3,
      productName: 'ผ้าเบรกหน้า (Click 110i / Scoopy i)',
      partNumber: 'HON-06455-KVB-T01',
      type: 'IN',
      quantity: 20,
      refDocument: 'PO-2026-002',
      note: 'รับจาก Nissin Thailand',
      createdBy: 'พนักงานคลังสินค้า',
      createdAt: '2026-07-22 09:00',
    },
    {
      id: 4,
      productId: 5,
      productName: 'หัวเทียน CPR6EA-9 (Wave 110i / Scoopy i / Click 125i)',
      partNumber: 'HON-31916-KRM-841',
      type: 'IN',
      quantity: 50,
      refDocument: 'PO-2026-001',
      note: 'สั่งซื้อล่วงหน้าสำหรับช่วงเทศกาล',
      createdBy: 'พนักงานคลังสินค้า',
      createdAt: '2026-07-25 11:20',
    },
    {
      id: 5,
      productId: 2,
      productName: 'ไส้กรองอากาศ (Spark 135 / Exciter 150)',
      partNumber: 'YAM-5YP-E4450-00',
      type: 'OUT',
      quantity: 9,
      refDocument: 'SO-2026-102',
      note: 'เบิกเปลี่ยนถ่ายตามระยะลูกค้าหน้าร้าน',
      createdBy: 'พนักงานขาย',
      createdAt: '2026-07-26 15:40',
    },
    {
      id: 6,
      productId: 7,
      productName: 'สายพานขับเคลื่อน (Scoopy i New / Zoomer-X)',
      partNumber: 'HON-23100-KZL-931',
      type: 'ADJUST',
      quantity: 2,
      refDocument: 'ADJ-DAMAGED',
      note: 'สินค้าชำรุดจากการขนส่ง (ซองฉีกขาด)',
      createdBy: 'พนักงานคลังสินค้า',
      createdAt: '2026-07-28 16:10',
    },
  ]);

  const addMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>): void => {
    const id = stockMovements.value.length > 0 ? Math.max(...stockMovements.value.map((m) => m.id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    stockMovements.value.unshift({
      ...movement,
      id,
      createdAt: now,
    });
  };

  return {
    stockMovements,
    addMovement,
  };
}
