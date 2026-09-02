import { apiRequest } from './api-client';
import type { Product } from '@/composables/use-products';

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

/**
 * ข้อมูลสินค้าในรูปแบบที่ Backend API ตอบกลับมา
 */
export interface BackendProduct {
  id: number;
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  unit: string;
  unitPrice: number | string;
  minStock?: number | null;
  maxStock?: number | null;
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * ข้อมูลสำหรับการสร้างหรือแก้ไขสินค้า
 */
export interface SaveProductInput {
  partNumber?: string;
  name?: string;
  salePrice?: number;
  reorderPoint?: number;
}

/**
 * แปลงค่าตัวเลขหรือข้อความตัวเลขให้เป็น number อย่างปลอดภัย
 * @param value ค่าที่ต้องการแปลงเป็นตัวเลข
 * @returns ผลลัพธ์ตัวเลข number
 */
function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * แปลงข้อมูลสินค้าจาก Backend API เป็นรูปแบบที่ Frontend ใช้
 * @param product ข้อมูลสินค้าจาก Backend
 * @returns ข้อมูลสินค้าสำหรับ Frontend
 */
export function mapProductFromApi(product: BackendProduct): Product {
  return {
    id: product.id,
    partNumber: product.sku,
    name: product.name,
    category: product.categoryId ? String(product.categoryId) : '',
    brand: '',
    type: 'OEM',
    costPrice: 0,
    salePrice: toNumber(product.unitPrice),
    stockQty: 0,
    reorderPoint: product.minStock ?? 0,
    crossReferences: [],
    unit: product.unit,
    maxStock: product.maxStock ?? 0,
    status: product.status ?? 'ACTIVE',
  };
}

/**
 * แปลงข้อมูลสินค้าจาก Frontend เป็นรูปแบบที่ Backend API ต้องการ
 * @param product ข้อมูลสินค้าฝั่ง Frontend
 * @returns Payload สำหรับส่ง API หลังบ้าน
 */
function mapProductToApi(product: SaveProductInput): Partial<BackendProduct> {
  const payload: Partial<BackendProduct> = {
    unit: 'ชิ้น',
    unitPrice: Number(product.salePrice) || 0,
    minStock: Number(product.reorderPoint) || 0,
    maxStock: 0,
    status: 'ACTIVE',
  };

  if (product.partNumber !== undefined) {
    payload.sku = product.partNumber;
  }
  if (product.name !== undefined) {
    payload.name = product.name;
  }

  return payload;
}

/**
 * ดึงรายการสินค้าทั้งหมดจาก Backend API (GET /admin/products)
 * @returns รายการสินค้าทั้งหมด
 */
export async function getProducts(): Promise<Product[]> {
  const products = await apiRequest<BackendProduct[]>('/admin/products');
  return products.map(mapProductFromApi);
}

/**
 * สร้างสินค้าใหม่ใน Backend API (POST /admin/products)
 * @param product ข้อมูลสินค้าที่ต้องการสร้าง
 * @returns ข้อมูลสินค้าที่สร้างสำเร็จ
 */
export async function createProduct(product: SaveProductInput): Promise<Product> {
  const created = await apiRequest<BackendProduct>('/admin/products', {
    method: 'POST',
    body: mapProductToApi(product),
  });
  return mapProductFromApi(created);
}

/**
 * แก้ไขข้อมูลสินค้าใน Backend API (PATCH /admin/products/:id)
 * @param id รหัส ID ของสินค้า
 * @param product ข้อมูลสินค้าที่ต้องการแก้ไข
 * @returns ข้อมูลสินค้าหลังอัปเดตสำเร็จ
 */
export async function updateProduct(id: number, product: SaveProductInput): Promise<Product> {
  const updated = await apiRequest<BackendProduct>(`/admin/products/${id}`, {
    method: 'PATCH',
    body: mapProductToApi(product),
  });
  return mapProductFromApi(updated);
}

/**
 * ลบสินค้าจาก Backend API (DELETE /admin/products/:id)
 * @param id รหัส ID ของสินค้าที่ต้องการลบ
 */
export async function deleteProduct(id: number): Promise<void> {
  await apiRequest<void>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}
