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
  const vehicleModels = ref<VehicleModel[]>([
    { id: 1, brand: 'Honda', model: 'Wave 110i', yearRange: '2009-2021', engineCc: 110 },
    { id: 2, brand: 'Honda', model: 'Click 110i', yearRange: '2008-2012', engineCc: 110 },
    { id: 3, brand: 'Honda', model: 'Scoopy i', yearRange: '2009-2017', engineCc: 110 },
    { id: 4, brand: 'Honda', model: 'Click 125i / 150i', yearRange: '2012-2022', engineCc: 125 },
    { id: 5, brand: 'Honda', model: 'PCX 150', yearRange: '2014-2020', engineCc: 150 },
    { id: 6, brand: 'Yamaha', model: 'Spark 135', yearRange: '2006-2015', engineCc: 135 },
    { id: 7, brand: 'Yamaha', model: 'Exciter 150', yearRange: '2015-2020', engineCc: 150 },
    { id: 8, brand: 'Yamaha', model: 'NMAX 155', yearRange: '2016-2023', engineCc: 155 },
    { id: 9, brand: 'Yamaha', model: 'AEROX 155', yearRange: '2017-2023', engineCc: 155 },
    { id: 10, brand: 'Yamaha', model: 'Fino 115', yearRange: '2007-2013', engineCc: 115 },
    { id: 11, brand: 'Suzuki', model: 'Raider 150', yearRange: '2013-2020', engineCc: 150 },
    { id: 12, brand: 'Kawasaki', model: 'Ninja 250 / Z250', yearRange: '2013-2017', engineCc: 250 },
  ]);

  const compatibilities = ref<CompatibilityMap[]>([
    { productId: 1, vehicleModelId: 1, note: 'ตรงรุ่น 90L' },
    { productId: 2, vehicleModelId: 6 },
    { productId: 2, vehicleModelId: 7 },
    { productId: 3, vehicleModelId: 2 },
    { productId: 3, vehicleModelId: 3 },
    { productId: 4, vehicleModelId: 11 },
    { productId: 5, vehicleModelId: 1 },
    { productId: 5, vehicleModelId: 3 },
    { productId: 5, vehicleModelId: 4 },
    { productId: 6, vehicleModelId: 8 },
    { productId: 7, vehicleModelId: 3 },
    { productId: 6, vehicleModelId: 10 },
    { productId: 8, vehicleModelId: 12 },
    { productId: 9, vehicleModelId: 1 },
    { productId: 9, vehicleModelId: 5 },
    { productId: 10, vehicleModelId: 8 },
    { productId: 10, vehicleModelId: 9 },
  ]);

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
