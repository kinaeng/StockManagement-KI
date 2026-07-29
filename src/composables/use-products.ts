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
  const products = ref<Product[]>([
    {
      id: 1,
      partNumber: 'HON-14401-KWW-600',
      name: 'โซ่ราวลิ้น 90 ข้อ (Wave 110i / CZ-i)',
      category: 'A1',
      brand: 'Honda OEM',
      type: 'OEM',
      costPrice: 120,
      salePrice: 220,
      stockQty: 2,
      reorderPoint: 5,
      crossReferences: ['DID-25H-90L', 'RK-25H-90L'],
      location: 'A-01-02',
    },
    {
      id: 2,
      partNumber: 'YAM-5YP-E4450-00',
      name: 'ไส้กรองอากาศ (Spark 135 / Exciter 150)',
      category: 'A2',
      brand: 'Yamaha OEM',
      type: 'OEM',
      costPrice: 85,
      salePrice: 150,
      stockQty: 1,
      reorderPoint: 10,
      crossReferences: ['KN-YA-135'],
      location: 'B-02-01',
    },
    {
      id: 3,
      partNumber: 'HON-06455-KVB-T01',
      name: 'ผ้าเบรกหน้า (Click 110i / Scoopy i)',
      category: 'B1',
      brand: 'Nissin',
      type: 'Aftermarket',
      costPrice: 90,
      salePrice: 180,
      stockQty: 3,
      reorderPoint: 8,
      crossReferences: ['BENDIX-MD2', 'NSS-FL01'],
      location: 'C-01-05',
    },
    {
      id: 4,
      partNumber: 'SUZ-16510-05240',
      name: 'กรองน้ำมันเครื่อง (Raider 150 / Smash)',
      category: 'B2',
      brand: 'Suzuki OEM',
      type: 'OEM',
      costPrice: 45,
      salePrice: 85,
      stockQty: 25,
      reorderPoint: 5,
      crossReferences: ['KN-131'],
      location: 'A-03-01',
    },
    {
      id: 5,
      partNumber: 'HON-31916-KRM-841',
      name: 'หัวเทียน CPR6EA-9 (Wave 110i / Scoopy i / Click 125i)',
      category: 'A1',
      brand: 'NGK',
      type: 'Aftermarket',
      costPrice: 55,
      salePrice: 95,
      stockQty: 40,
      reorderPoint: 15,
      crossReferences: ['DENSO-U20EPR9'],
      location: 'D-01-03',
    },
    {
      id: 6,
      partNumber: 'YAM-93106-20808',
      name: 'ซีลโช้คหน้า 26-37-10.5 (Mio / Fino / NMAX)',
      category: 'A2',
      brand: 'Yamaha OEM',
      type: 'OEM',
      costPrice: 35,
      salePrice: 70,
      stockQty: 4,
      reorderPoint: 10,
      crossReferences: ['NOK-263710'],
      location: 'E-02-04',
    },
    {
      id: 7,
      partNumber: 'HON-23100-KZL-931',
      name: 'สายพานขับเคลื่อน (Scoopy i New / Zoomer-X)',
      category: 'B1',
      brand: 'Bando',
      type: 'Aftermarket',
      costPrice: 210,
      salePrice: 380,
      stockQty: 8,
      reorderPoint: 5,
      crossReferences: ['HON-23100-KZL-930', 'MITSUBOSHI-23100'],
      location: 'B-04-02',
    },
    {
      id: 8,
      partNumber: 'KAW-11013-0762',
      name: 'ไส้กรองอากาศ (Ninja 250 / Z250 / Ninja 300)',
      category: 'B2',
      brand: 'Kawasaki OEM',
      type: 'OEM',
      costPrice: 280,
      salePrice: 450,
      stockQty: 6,
      reorderPoint: 3,
      crossReferences: ['KN-KA-2508'],
      location: 'B-02-05',
    },
    {
      id: 9,
      partNumber: 'HON-51490-KRM-852',
      name: 'ชุดซีลโช้คหน้าพร้อมซีลกันฝุ่น (Wave / PCX 150)',
      category: 'A1',
      brand: 'Honda OEM',
      type: 'OEM',
      costPrice: 130,
      salePrice: 240,
      stockQty: 18,
      reorderPoint: 8,
      crossReferences: ['SKF-31MM'],
      location: 'E-02-01',
    },
    {
      id: 10,
      partNumber: 'YAM-2DP-E7641-00',
      name: 'สายพานขับเคลื่อน (NMAX 155 / AEROX 155)',
      category: 'B1',
      brand: 'Yamaha OEM',
      type: 'OEM',
      costPrice: 320,
      salePrice: 520,
      stockQty: 3,
      reorderPoint: 6,
      crossReferences: ['BANDO-2DP', 'MITSUBOSHI-NMAX'],
      location: 'B-04-05',
    },
  ]);

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
