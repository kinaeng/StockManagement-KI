import { ref, computed } from 'vue';

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
}

export function useProducts() {
  const products = ref<Product[]>([]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const totalProducts = computed((): number => products.value.length);
  const lowStockCount = computed(
    (): number => products.value.filter((p) => p.stockQty <= p.reorderPoint).length,
  );

  const addProduct = (newProduct: Omit<Product, 'id'>): void => {
    const id = products.value.length > 0 ? Math.max(...products.value.map((p) => p.id)) + 1 : 1;
    products.value.push({ ...newProduct, id });
  };

  const updateProduct = (id: number, updatedFields: Partial<Product>): void => {
    const index = products.value.findIndex((p) => p.id === id);
    const existing = products.value[index];
    if (existing) {
      Object.assign(existing, updatedFields);
    }
  };

  const deleteProduct = (id: number): void => {
    products.value = products.value.filter((p) => p.id !== id);
  };

  return {
    products,
    isLoading,
    error,
    totalProducts,
    lowStockCount,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
