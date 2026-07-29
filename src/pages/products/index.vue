<template>
  <q-page class="q-pa-lg">
      <!-- Page Header -->
      <div class="page-header row items-center justify-between">
      <div>
        <h1 class="page-header__title">จัดการข้อมูลสินค้า (Products)</h1>
        <p class="page-header__subtitle">
          รายการอะไหล่มอเตอร์ไซค์ทั้งหมดและเบอร์อะไหล่เทียบ (FR-1)
        </p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="เพิ่มสินค้าใหม่"
        no-caps
        unelevated
        @click="openAddModal"
      />
    </div>

    <!-- Filter Bar -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-sm items-center q-py-sm">
        <div class="col-12 col-sm-4">
          <q-select
            v-model="filterCategory"
            outlined
            dense
            clearable
            :options="categoryOptions"
            label="กรองตามหมวดหมู่"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-select
            v-model="filterBrand"
            outlined
            dense
            clearable
            :options="brandOptions"
            label="กรองตามยี่ห้อ"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-select
            v-model="filterType"
            outlined
            dense
            clearable
            :options="typeOptions"
            label="กรองตามประเภท"
            emit-value
            map-options
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Products Table -->
    <BaseTable
      title="รายการอะไหล่ทั้งหมด"
      :rows="filteredProducts"
      :columns="columns"
    >
      <template #body-cell-type="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.type === 'OEM' ? 'blue-9' : 'teal-8'"
            text-color="white"
            size="sm"
          >
            {{ props.row.type }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-stockQty="props">
        <q-td :props="props">
          <span
            :class="{
              'text-negative text-weight-bold': props.row.stockQty <= props.row.reorderPoint,
              'text-positive': props.row.stockQty > props.row.reorderPoint,
            }"
          >
            {{ props.row.stockQty }}
          </span>
        </q-td>
      </template>

      <template #body-cell-crossReferences="props">
        <q-td :props="props">
          <q-chip
            v-for="cross in props.row.crossReferences"
            :key="cross"
            dense
            outline
            color="primary"
            size="xs"
            class="q-mr-xs"
          >
            {{ cross }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" align="right">
          <q-btn flat round dense icon="edit" color="warning" @click="editProduct(props.row)">
            <q-tooltip>แก้ไข</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="delete" color="negative" @click="removeProduct(props.row.id)">
            <q-tooltip>ลบ</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>

    <!-- Add/Edit Modal -->
    <BaseModal
      v-model="isModalOpen"
      :title="isEditMode ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'"
      confirm-label="บันทึก"
      @confirm="saveProduct"
    >
      <div class="q-gutter-md">
        <q-input v-model="form.partNumber" outlined dense label="รหัสสินค้า (Part Number)" />
        <q-input v-model="form.name" outlined dense label="ชื่อสินค้า / อะไหล่" />

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input v-model="form.category" outlined dense label="หมวดหมู่" />
          </div>
          <div class="col-6">
            <q-input v-model="form.brand" outlined dense label="ยี่ห้อ" />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-select
              v-model="form.type"
              outlined
              dense
              :options="['OEM', 'Aftermarket']"
              label="ประเภทสินค้า"
            />
          </div>
          <div class="col-6">
            <q-input v-model.number="form.reorderPoint" type="number" outlined dense label="จุดสั่งซื้อ (Min Reorder)" />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input v-model.number="form.costPrice" type="number" outlined dense label="ราคาทุน (บาท)" />
          </div>
          <div class="col-6">
            <q-input v-model.number="form.salePrice" type="number" outlined dense label="ราคาขาย (บาท)" />
          </div>
        </div>

        <q-input
          v-model="crossRefInput"
          outlined
          dense
          label="เบอร์อะไหล่เทียบ (ใส่เครื่องหมาย , เพื่อคั่น)"
          hint="ตัวอย่าง: DID-25H-90L, RK-25H-90L"
        />
      </div>
    </BaseModal>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { useProducts, type Product } from '@/composables/use-products';

const { products, addProduct, updateProduct, deleteProduct } = useProducts();

const columns = [
  { name: 'partNumber', label: 'รหัสสินค้า (Part No.)', field: 'partNumber', align: 'left' as const, sortable: true },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' as const, sortable: true },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left' as const },
  { name: 'brand', label: 'ยี่ห้อ', field: 'brand', align: 'left' as const },
  { name: 'type', label: 'ประเภท', field: 'type', align: 'center' as const },
  { name: 'salePrice', label: 'ราคาขาย (฿)', field: 'salePrice', align: 'right' as const },
  { name: 'stockQty', label: 'สต็อกคงเหลือ', field: 'stockQty', align: 'right' as const, sortable: true },
  { name: 'crossReferences', label: 'เบอร์เทียบ', field: 'crossReferences', align: 'left' as const },
  { name: 'actions', label: 'จัดการ', field: 'actions', align: 'right' as const },
];

// Filters
const filterCategory = ref<string | null>(null);
const filterBrand = ref<string | null>(null);
const filterType = ref<string | null>(null);

const categoryOptions = computed(() =>
  [...new Set(products.value.map((p) => p.category))].map((c) => ({ label: c, value: c })),
);
const brandOptions = computed(() =>
  [...new Set(products.value.map((p) => p.brand))].map((b) => ({ label: b, value: b })),
);
const typeOptions = [
  { label: 'OEM', value: 'OEM' },
  { label: 'Aftermarket', value: 'Aftermarket' },
];

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    if (filterCategory.value && p.category !== filterCategory.value) return false;
    if (filterBrand.value && p.brand !== filterBrand.value) return false;
    if (filterType.value && p.type !== filterType.value) return false;
    return true;
  }),
);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const editingId = ref<number | null>(null);
const crossRefInput = ref('');

const form = reactive<Omit<Product, 'id' | 'stockQty'>>({
  partNumber: '',
  name: '',
  category: '',
  brand: '',
  type: 'OEM',
  costPrice: 0,
  salePrice: 0,
  reorderPoint: 5,
  crossReferences: [],
});

function openAddModal(): void {
  isEditMode.value = false;
  editingId.value = null;
  form.partNumber = '';
  form.name = '';
  form.category = '';
  form.brand = '';
  form.type = 'OEM';
  form.costPrice = 0;
  form.salePrice = 0;
  form.reorderPoint = 5;
  crossRefInput.value = '';
  isModalOpen.value = true;
}

function editProduct(product: Product): void {
  isEditMode.value = true;
  editingId.value = product.id;
  form.partNumber = product.partNumber;
  form.name = product.name;
  form.category = product.category;
  form.brand = product.brand;
  form.type = product.type;
  form.costPrice = product.costPrice;
  form.salePrice = product.salePrice;
  form.reorderPoint = product.reorderPoint;
  crossRefInput.value = product.crossReferences.join(', ');
  isModalOpen.value = true;
}

function saveProduct(): void {
  const crossRefs = crossRefInput.value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (isEditMode.value && editingId.value !== null) {
    updateProduct(editingId.value, { ...form, crossReferences: crossRefs });
  } else {
    addProduct({ ...form, stockQty: 0, crossReferences: crossRefs });
  }

  isModalOpen.value = false;
}

function removeProduct(id: number): void {
  if (confirm('คุณต้องการลบรายการสินค้านี้ใช่หรือไม่?')) {
    deleteProduct(id);
  }
}
</script>
