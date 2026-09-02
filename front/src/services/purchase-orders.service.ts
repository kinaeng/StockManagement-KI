import { apiRequest } from './api-client';
import type { PurchaseOrder, POItem } from '@/composables/use-suppliers';

export type POStatus = 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';

/**
 * รายการสินค้าในใบสั่งซื้อจาก Backend API
 */
export interface BackendPOItem {
  id?: number;
  productId: number;
  orderedQty: number;
  receivedQty?: number;
  unitCost: number | string;
  totalPrice?: number | string;
  product?: {
    id: number;
    sku: string;
    name: string;
  };
}

/**
 * ข้อมูลใบสั่งซื้อจาก Backend API
 */
export interface BackendPurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplier?: {
    id: number;
    name: string;
    code?: string;
  };
  totalAmount: number | string;
  status: POStatus;
  orderDate?: string | null;
  expectedDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  items?: BackendPOItem[];
}

/**
 * ข้อมูลรายการสินค้าเมื่อสร้างใบสั่งซื้อ
 */
export interface CreatePOItemInput {
  productId: number;
  orderedQty: number;
  unitCost: number;
}

/**
 * ข้อมูลสำหรับสร้างใบสั่งซื้อใหม่
 */
export interface CreatePOInput {
  poNumber: string;
  supplierId: number;
  status?: POStatus;
  items?: CreatePOItemInput[];
}

/**
 * ข้อมูลสำหรับอัปเดตใบสั่งซื้อ
 */
export interface UpdatePOInput {
  status?: POStatus;
  supplierId?: number;
  items?: CreatePOItemInput[];
}

/**
 * แปลงค่าตัวเลขหรือข้อความตัวเลขให้เป็น number อย่างปลอดภัย
 * @param val ค่าตัวเลขหรือ string
 * @returns ค่าตัวเลข number
 */
function toNumber(val: number | string | null | undefined): number {
  if (val === null || val === undefined) return 0;
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
}

/**
 * แปลงข้อมูลใบสั่งซื้อจาก Backend API เป็นรูปแบบที่ Frontend ใช้
 * @param po ข้อมูลใบสั่งซื้อจาก Backend
 * @param supplierNameMap Map จับคู่ระหว่าง supplierId กับชื่อซัพพลายเออร์ (optional)
 * @returns ข้อมูลใบสั่งซื้อสำหรับ Frontend
 */
export function mapPOFromApi(
  po: BackendPurchaseOrder,
  supplierNameMap?: Map<number, string>,
): PurchaseOrder {
  const items: POItem[] = (po.items ?? []).map((item) => {
    const qty = item.orderedQty ?? 1;
    const cost = toNumber(item.unitCost);
    const total = item.totalPrice !== undefined ? toNumber(item.totalPrice) : qty * cost;
    const poItem: POItem = {
      productId: item.productId,
      partNumber: item.product?.sku ?? '',
      productName: item.product?.name ?? `สินค้า #${item.productId}`,
      quantity: qty,
      unitPrice: cost,
      totalPrice: total,
    };
    if (item.id !== undefined) {
      poItem.id = item.id;
    }
    return poItem;
  });

  const supplierName =
    po.supplier?.name ||
    (supplierNameMap ? supplierNameMap.get(po.supplierId) : undefined) ||
    `ผู้จำหน่าย #${po.supplierId}`;

  return {
    id: po.id,
    poNumber: po.poNumber,
    supplierId: po.supplierId,
    supplierName,
    items,
    totalAmount: toNumber(po.totalAmount),
    status: po.status,
    createdAt: po.createdAt ? po.createdAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
  };
}

/**
 * ดึงรายการใบสั่งซื้อทั้งหมดจาก Backend API (GET /admin/purchase-orders)
 * @param supplierNameMap Map จับคู่ระหว่าง supplierId กับชื่อซัพพลายเออร์ (optional)
 * @returns รายการใบสั่งซื้อทั้งหมด
 */
export async function getPurchaseOrders(
  supplierNameMap?: Map<number, string>,
): Promise<PurchaseOrder[]> {
  const orders = await apiRequest<BackendPurchaseOrder[]>('/admin/purchase-orders');
  return orders.map((po) => mapPOFromApi(po, supplierNameMap));
}

/**
 * สร้างใบสั่งซื้อใหม่ใน Backend API (POST /admin/purchase-orders)
 * @param input ข้อมูลสำหรับสร้างใบสั่งซื้อ
 * @param supplierNameMap Map จับคู่รหัสผู้จำหน่ายกับชื่อผู้จำหน่าย
 * @returns ใบสั่งซื้อที่สร้างสำเร็จ
 */
export async function createPurchaseOrder(
  input: CreatePOInput,
  supplierNameMap?: Map<number, string>,
): Promise<PurchaseOrder> {
  const created = await apiRequest<BackendPurchaseOrder>('/admin/purchase-orders', {
    method: 'POST',
    body: input,
  });
  return mapPOFromApi(created, supplierNameMap);
}

/**
 * แก้ไขข้อมูลหรืออัปเดตสถานะใบสั่งซื้อใน Backend API (PATCH /admin/purchase-orders/:id)
 * @param id รหัส ID ของใบสั่งซื้อ
 * @param input ข้อมูลที่ต้องการอัปเดต (เช่น เปลี่ยนสถานะเป็น RECEIVED)
 * @param supplierNameMap Map จับคู่รหัสผู้จำหน่ายกับชื่อผู้จำหน่าย
 * @returns ใบสั่งซื้อหลังอัปเดตสำเร็จ
 */
export async function updatePurchaseOrder(
  id: number,
  input: UpdatePOInput,
  supplierNameMap?: Map<number, string>,
): Promise<PurchaseOrder> {
  const updated = await apiRequest<BackendPurchaseOrder>(`/admin/purchase-orders/${id}`, {
    method: 'PATCH',
    body: input,
  });
  return mapPOFromApi(updated, supplierNameMap);
}

/**
 * ลบใบสั่งซื้อจาก Backend API (DELETE /admin/purchase-orders/:id)
 * @param id รหัส ID ของใบสั่งซื้อที่ต้องการลบ
 */
export async function deletePurchaseOrder(id: number): Promise<void> {
  await apiRequest<void>(`/admin/purchase-orders/${id}`, {
    method: 'DELETE',
  });
}
