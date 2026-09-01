import { ref } from 'vue';

export interface VehicleModel {
  id: number;
  brand: string;
  model: string;
  yearRange: string;
  engineCc: number;
}

export interface CompatibilityMap {
  productId: number;
  vehicleModelId: number;
  note?: string;
}

export function useVehicles() {
  const vehicleModels = ref<VehicleModel[]>([]);

  const compatibilities = ref<CompatibilityMap[]>([]);

  const addVehicleModel = (newModel: Omit<VehicleModel, 'id'>): void => {
    const id =
      vehicleModels.value.length > 0 ? Math.max(...vehicleModels.value.map((v) => v.id)) + 1 : 1;
    vehicleModels.value.push({ ...newModel, id });
  };

  const addCompatibility = (map: CompatibilityMap): void => {
    compatibilities.value.push(map);
  };

  const removeCompatibility = (productId: number, vehicleModelId: number): void => {
    compatibilities.value = compatibilities.value.filter(
      (c) => !(c.productId === productId && c.vehicleModelId === vehicleModelId),
    );
  };

  return {
    vehicleModels,
    compatibilities,
    addVehicleModel,
    addCompatibility,
    removeCompatibility,
  };
}
