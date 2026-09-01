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
  const stockMovements = ref<StockMovement[]>([]);

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
