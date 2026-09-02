import { apiRequest } from './api-client';
import type { Supplier } from '@/composables/use-suppliers';

/**
 * รูปแบบข้อมูลผู้จำหน่ายจาก Backend API
 */
export interface BackendSupplier {
  id: number;
  code: string;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * รูปแบบข้อมูลสำหรับสร้างหรือแก้ไขผู้จำหน่าย
 */
export interface SaveSupplierInput {
  code?: string;
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
}

/**
 * แปลงข้อมูลผู้จำหน่ายจากรูปแบบ Backend API เป็นรูปแบบที่ Frontend ใช้
 * @param supplier ข้อมูลผู้จำหน่ายจาก Backend
 * @returns ข้อมูลผู้จำหน่ายสำหรับ Frontend
 */
export function mapSupplierFromApi(supplier: BackendSupplier): Supplier {
  const result: Supplier = {
    id: supplier.id,
    code: supplier.code,
    name: supplier.name,
    contactPerson: supplier.contactName ?? '',
    phone: supplier.phone ?? '',
    email: supplier.email ?? '',
  };
  if (supplier.address) result.address = supplier.address;
  if (supplier.taxId) result.taxId = supplier.taxId;
  return result;
}

/**
 * แปลงข้อมูลผู้จำหน่ายจาก Frontend เป็นรูปแบบที่ Backend API ต้องการ
 * @param supplier ข้อมูลผู้จำหน่ายที่ส่งมาจาก Frontend
 * @returns Payload ที่พร้อมส่งให้ Backend API
 */
function mapSupplierToApi(supplier: SaveSupplierInput): Partial<BackendSupplier> {
  const payload: Partial<BackendSupplier> = {};
  if (supplier.code !== undefined) payload.code = supplier.code;
  if (supplier.name !== undefined) payload.name = supplier.name;
  if (supplier.contactPerson !== undefined) payload.contactName = supplier.contactPerson;
  if (supplier.phone !== undefined) payload.phone = supplier.phone;
  if (supplier.email !== undefined) payload.email = supplier.email;
  if (supplier.address !== undefined) payload.address = supplier.address;
  if (supplier.taxId !== undefined) payload.taxId = supplier.taxId;
  return payload;
}

/**
 * ดึงรายการผู้จำหน่ายทั้งหมดจาก Backend API (GET /admin/suppliers)
 * @returns รายการผู้จำหน่ายทั้งหมด
 */
export async function getSuppliers(): Promise<Supplier[]> {
  const suppliers = await apiRequest<BackendSupplier[]>('/admin/suppliers');
  return suppliers.map(mapSupplierFromApi);
}

/**
 * สร้างผู้จำหน่ายรายใหม่ใน Backend API (POST /admin/suppliers)
 * @param supplier ข้อมูลผู้จำหน่ายที่ต้องการสร้าง
 * @returns ข้อมูลผู้จำหน่ายที่สร้างสำเร็จ
 */
export async function createSupplier(supplier: SaveSupplierInput): Promise<Supplier> {
  const created = await apiRequest<BackendSupplier>('/admin/suppliers', {
    method: 'POST',
    body: mapSupplierToApi(supplier),
  });
  return mapSupplierFromApi(created);
}

/**
 * แก้ไขข้อมูลผู้จำหน่ายใน Backend API (PATCH /admin/suppliers/:id)
 * @param id รหัส ID ของผู้จำหน่าย
 * @param supplier ข้อมูลที่ต้องการอัปเดต
 * @returns ข้อมูลผู้จำหน่ายหลังอัปเดตสำเร็จ
 */
export async function updateSupplier(id: number, supplier: SaveSupplierInput): Promise<Supplier> {
  const updated = await apiRequest<BackendSupplier>(`/admin/suppliers/${id}`, {
    method: 'PATCH',
    body: mapSupplierToApi(supplier),
  });
  return mapSupplierFromApi(updated);
}

/**
 * ลบผู้จำหน่ายจาก Backend API (DELETE /admin/suppliers/:id)
 * @param id รหัส ID ของผู้จำหน่ายที่ต้องการลบ
 */
export async function deleteSupplier(id: number): Promise<void> {
  await apiRequest<void>(`/admin/suppliers/${id}`, {
    method: 'DELETE',
  });
}
