import { ref, computed } from 'vue';
import * as productsService from '@/services/products.service';

export interface Product {
  id: number;
  partNumber: string;
  name: string;
  category: string;
  brand: string;
  type: 'OEM' | 'Aftermarket';
  costPrice: number;
  salePrice: number;
  stockQty: number;
  reorderPoint: number;
  crossReferences: string[];
  imageUrl?: string;
  location?: string;
  unit?: string;
  maxStock?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export function useProducts() {
  const products = ref<Product[]>([]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const totalProducts = computed((): number => products.value.length);
  const lowStockCount = computed(
    (): number => products.value.filter((p) => p.stockQty <= p.reorderPoint).length,
  );

  const loadProducts = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      products.value = await productsService.getProducts();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'โหลดข้อมูลสินค้าไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id' | 'stockQty'> & { stockQty?: number }): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const product = await productsService.createProduct(newProduct);
      products.value.unshift(product);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เพิ่มสินค้าไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProduct = async (
    id: number,
    updatedFields: Partial<Omit<Product, 'id'>>,
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const updatedProduct = await productsService.updateProduct(id, updatedFields);
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'แก้ไขสินค้าไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      await productsService.deleteProduct(id);
      products.value = products.value.filter((p) => p.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'ลบสินค้าไม่สำเร็จ';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    products,
    isLoading,
    error,
    totalProducts,
    lowStockCount,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
