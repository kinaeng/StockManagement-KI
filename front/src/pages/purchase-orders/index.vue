<template>
  <q-page class="q-pa-xs-sm q-pa-md">
    <BasePageHeader
      title="ประวัติใบสั่งซื้อสินค้า (Purchase Orders)"
      subtitle="ตรวจสอบประวัติการสั่งซื้อ รายการสินค้าที่สั่ง และติดตามสถานะ PO"
    >
      <template #actions>
        <q-btn
          color="primary"
          icon="add_shopping_cart"
          label="สร้างใบสั่งซื้อ (PO) ใหม่"
          class="full-width-xs text-weight-bold"
          unelevated
          @click="openCreateModal"
        />
      </template>
    </BasePageHeader>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="stat-card__label">จำนวน PO ทั้งหมด</div>
              <div class="stat-card__value">{{ totalPOCount }}</div>
            </div>
            <div class="stat-card__icon stat-card__icon--blue">
              <q-icon name="receipt_long" size="24px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="stat-card__label">รอสินค้า</div>
              <div class="stat-card__value">{{ orderedPOCount }}</div>
            </div>
            <div class="stat-card__icon stat-card__icon--amber">
              <q-icon name="schedule" size="24px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="stat-card__label">รับแล้ว</div>
              <div class="stat-card__value">{{ receivedPOCount }}</div>
            </div>
            <div class="stat-card__icon stat-card__icon--green">
              <q-icon name="check_circle" size="24px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Table of Purchase Orders -->
    <BaseTable
      title="รายการใบสั่งซื้อย้อนหลัง"
      :rows="purchaseOrders"
      :columns="columns"
      :loading="isLoading"
    >
      <template #body-cell-itemsCount="props">
        <q-td :props="props">
          <q-chip color="blue-1" text-color="blue-9" size="sm" class="q-px-xs text-weight-bold">
            <q-icon name="list_alt" size="14px" class="q-mr-xs" />
            {{ props.row.items?.length || 0 }} รายการ
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-totalAmount="props">
        <q-td :props="props" class="text-weight-bold text-primary">
          ฿{{ Number(props.row.totalAmount || 0).toLocaleString() }}
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-select
            :model-value="props.row.status"
            :options="statusOptions"
            emit-value
            map-options
            dense
            borderless
            class="status-select"
            @update:model-value="(val) => handleStatusChange(props.row.id, val)"
          >
            <template #selected>
              <q-chip
                :color="getStatusColor(props.row.status)"
                text-color="white"
                size="sm"
                class="q-ma-none cursor-pointer"
              >
                {{ getStatusLabel(props.row.status) }}
                <q-icon name="arrow_drop_down" class="q-ml-xs" />
              </q-chip>
            </template>
          </q-select>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" align="right">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="visibility"
            @click="viewPoDetail(props.row)"
          >
            <q-tooltip>ดูรายการสินค้าที่สั่งไว้ในใบนี้</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>

    <!-- Create PO Modal with Dynamic Items List -->
    <q-dialog v-model="isCreateModalOpen" persistent>
      <q-card class="create-po-card">
        <q-card-section class="create-po-card__header row items-center justify-between">
          <div class="text-h6 text-weight-bold text-primary row items-center">
            <q-icon name="add_shopping_cart" class="q-mr-xs" />
            สร้างใบสั่งซื้อสินค้า (PO) ใหม่
          </div>
          <q-btn flat round dense icon="close" v-close-popup>
            <q-tooltip>ปิด</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="create-po-card__body q-gutter-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.poNumber"
                outlined
                dense
                label="เลขที่ใบสั่งซื้อ (PO Number)"
                hint="ตัวอย่าง: PO-2026-001"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="selectedSupplier"
                outlined
                dense
                :options="supplierOptions"
                label="เลือกผู้จำหน่าย / ซัพพลายเออร์"
                emit-value
                map-options
              />
            </div>
          </div>

          <!-- Item Selection Section -->
          <div class="text-subtitle2 text-weight-bold q-mt-md row items-center justify-between">
            <span>
              <q-icon name="format_list_bulleted" color="primary" class="q-mr-xs" />
              รายการสินค้าที่จะสั่งซื้อ
            </span>
            <q-btn
              flat
              dense
              color="primary"
              icon="add"
              label="เพิ่มรายการสินค้า"
              no-caps
              size="sm"
              @click="addItemRow"
            />
          </div>

          <q-card flat bordered class="q-pa-sm" style="background: var(--color-bg-surface)">
            <div
              v-for="(item, index) in formItems"
              :key="index"
              class="row q-col-gutter-xs items-center q-mb-sm"
            >
              <!-- Select Product -->
              <div class="col-12 col-sm-5">
                <q-select
                  v-model="item.selectedProduct"
                  outlined
                  dense
                  :options="productOptions"
                  label="เลือกสินค้า / อะไหล่"
                  @update:model-value="(prod) => handleProductSelect(index, prod)"
                />
              </div>

              <!-- Quantity -->
              <div class="col-12 col-sm-2">
                <q-input
                  v-model.number="item.quantity"
                  type="number"
                  outlined
                  dense
                  label="จำนวน"
                  min="1"
                  :rules="[(val) => Number(val) >= 1 || 'จำนวนต้องอย่างน้อย 1']"
                  @update:model-value="normalizeQuantity(index)"
                />
              </div>

              <!-- Unit Price -->
              <div class="col-12 col-sm-2">
                <q-input
                  v-model.number="item.unitPrice"
                  type="number"
                  outlined
                  dense
                  label="ราคา/หน่วย"
                  min="0"
                  @update:model-value="calcItemTotal(index)"
                />
              </div>

              <!-- Subtotal -->
              <div class="col-12 col-sm-2 text-left text-sm-right text-weight-bold text-primary">
                ฿{{ item.totalPrice.toLocaleString() }}
              </div>

              <!-- Delete row -->
              <div class="col-12 col-sm-1 text-left text-sm-center">
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete_outline"
                  size="sm"
                  :disable="formItems.length <= 1"
                  @click="removeItemRow(index)"
                >
                  <q-tooltip>{{
                    formItems.length <= 1 ? 'ต้องมีอย่างน้อย 1 รายการ' : 'ลบ'
                  }}</q-tooltip>
                </q-btn>
              </div>
            </div>

            <q-banner
              v-if="duplicateProductNames.length > 0"
              dense
              rounded
              class="bg-amber-1 text-amber-10 q-mt-sm"
            >
              <template #avatar>
                <q-icon name="warning" color="warning" />
              </template>
              พบสินค้าซ้ำ:
              {{ duplicateProductNames.join(', ') }} กรุณารวมจำนวนในแถวเดียวเพื่อลดความสับสน
            </q-banner>

            <!-- Total Bar inside Create Form -->
            <div class="row justify-between items-center q-pt-sm q-px-sm border-top">
              <span class="text-caption text-grey-7">รวมทั้งหมด {{ formItems.length }} รายการ</span>
              <div class="text-subtitle1 text-weight-bold text-primary">
                ยอดรวมทั้งสิ้น: ฿{{ calculatedGrandTotal.toLocaleString() }}
              </div>
            </div>
          </q-card>

          <q-input
            v-model="form.note"
            outlined
            dense
            type="textarea"
            rows="2"
            label="หมายเหตุเพิ่มเติม (ถ้ามี)"
            counter
            maxlength="250"
          />
        </q-card-section>

        <q-card-actions align="right" class="create-po-card__footer q-pa-md bg-grey-1">
          <q-btn outline label="ยกเลิก" v-close-popup color="primary" no-caps />
          <q-btn
            color="primary"
            label="บันทึกใบสั่งซื้อ"
            unelevated
            no-caps
            class="text-weight-bold"
            :loading="isLoading"
            :disable="!selectedSupplier || formItems.length === 0 || !formItems.some(i => !!i.selectedProduct)"
            @click="savePO"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Detail View Modal -->
    <q-dialog v-model="isDetailModalOpen">
      <q-card
        style="width: 720px; max-width: 95vw; border-radius: var(--radius-lg)"
        v-if="selectedPO"
      >
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div>
            <div class="text-h6 text-weight-bold row items-center">
              <q-icon name="receipt" class="q-mr-xs" />
              ใบสั่งซื้อเลขที่: {{ selectedPO.poNumber }}
            </div>
            <div class="text-caption">วันที่สั่งซื้อ: {{ selectedPO.createdAt }}</div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup color="white">
            <q-tooltip>ปิด</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <!-- Header Info Card -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">ผู้จำหน่าย (Supplier)</div>
              <div class="text-subtitle2 text-weight-bold">{{ selectedPO.supplierName }}</div>
            </div>
            <div class="col-12 col-sm-6 text-right-sm">
              <div class="text-caption text-grey-7">สถานะสั่งซื้อ</div>
              <q-chip
                :color="getStatusColor(selectedPO.status)"
                text-color="white"
                size="sm"
                class="text-weight-bold q-ma-none"
              >
                {{ getStatusLabel(selectedPO.status) }}
              </q-chip>
            </div>
          </div>

          <q-separator class="q-my-sm" />

          <!-- Ordered Items Table -->
          <div class="text-subtitle2 text-weight-bold q-mb-sm row items-center">
            <q-icon name="inventory_2" color="primary" class="q-mr-xs" />
            รายการสินค้าที่สั่งซื้อไว้ทั้งหมด ({{ selectedPO.items?.length || 0 }} รายการ)
          </div>

          <q-markup-table flat bordered dense class="q-mb-md">
            <thead>
              <tr class="bg-grey-2 text-left">
                <th>#</th>
                <th>รหัสสินค้า</th>
                <th>รายการอะไหล่ / สินค้า</th>
                <th class="text-center">จำนวนที่สั่ง</th>
                <th class="text-right">ราคา/หน่วย</th>
                <th class="text-right">ราคารวม (฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in selectedPO.items" :key="item.id || idx">
                <td>{{ idx + 1 }}</td>
                <td class="text-grey-8" style="font-family: monospace">
                  {{ item.partNumber || '-' }}
                </td>
                <td class="text-weight-medium">{{ item.productName }}</td>
                <td class="text-center text-weight-bold">{{ item.quantity }}</td>
                <td class="text-right">฿{{ Number(item.unitPrice).toLocaleString() }}</td>
                <td class="text-right text-weight-bold text-primary">
                  ฿{{ Number(item.totalPrice).toLocaleString() }}
                </td>
              </tr>
              <tr v-if="!selectedPO.items || selectedPO.items.length === 0">
                <td colspan="6" class="text-center text-grey-6 q-pa-md">
                  ไม่มีรายละเอียดรายการสินค้า
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <!-- Grand Total Summary -->
          <div class="row justify-between items-center q-pa-md bg-blue-1 rounded-borders">
            <div class="text-caption text-grey-8">
              <span v-if="selectedPO.note">📌 หมายเหตุ: {{ selectedPO.note }}</span>
            </div>
            <div class="text-subtitle1 text-weight-bold text-primary">
              ยอดรวมสุทธิ: ฿{{ Number(selectedPO.totalAmount).toLocaleString() }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn outline color="primary" label="ปิดหน้าต่าง" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import BasePageHeader from '@/components/base/BasePageHeader.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { useSuppliers, type PurchaseOrder } from '@/composables/use-suppliers';
import { useProducts, type Product } from '@/composables/use-products';

const $q = useQuasar();
const { purchaseOrders, suppliers, isLoading, loadSuppliers, loadPurchaseOrders, addPO, updatePOStatus } = useSuppliers();
const { products, loadProducts } = useProducts();

const statusOptions = [
  { label: 'รับสินค้าแล้ว', value: 'RECEIVED' },
  { label: 'รอสินค้า (Ordered)', value: 'ORDERED' },
  { label: 'ฉบับร่าง', value: 'DRAFT' },
  { label: 'ยกเลิก', value: 'CANCELLED' },
];

const columns = [
  {
    name: 'poNumber',
    label: 'เลขที่ PO',
    field: 'poNumber',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'supplierName', label: 'ผู้จำหน่าย', field: 'supplierName', align: 'left' as const },
  {
    name: 'itemsCount',
    label: 'จำนวนรายการที่สั่ง',
    field: 'itemsCount',
    align: 'center' as const,
  },
  {
    name: 'totalAmount',
    label: 'ยอดรวม (฿)',
    field: 'totalAmount',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'status', label: 'สถานะ PO', field: 'status', align: 'center' as const },
  { name: 'createdAt', label: 'วันที่สั่งซื้อ', field: 'createdAt', align: 'left' as const },
  { name: 'actions', label: 'ดูรายการสินค้า', field: 'actions', align: 'right' as const },
];

const supplierOptions = computed(() =>
  suppliers.value.map((s) => ({
    label: s.name,
    value: s.id,
  })),
);

// Product options for creation form select
const productOptions = computed(() =>
  products.value.map((p: Product) => ({
    label: `${p.name} (${p.partNumber})`,
    value: p.id,
    partNumber: p.partNumber,
    name: p.name,
    costPrice: p.costPrice || p.salePrice || 0,
  })),
);

interface ProductOption {
  label: string;
  value: number;
  partNumber: string;
  name: string;
  costPrice: number;
}

interface FormItemRow {
  selectedProduct: ProductOption | null;
  partNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const isCreateModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedPO = ref<PurchaseOrder | null>(null);
const selectedSupplier = ref<number | null>(null);

const formItems = ref<FormItemRow[]>([]);
const form = reactive({
  poNumber: '',
  note: '',
});

onMounted(async () => {
  try {
    await loadSuppliers();
    await loadProducts();
    await loadPurchaseOrders();
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'โหลดข้อมูลใบสั่งซื้อไม่สำเร็จ',
    });
  }
});

function generateNextPONumber(): string {
  const year = new Date().getFullYear();
  const nextSeq = String(purchaseOrders.value.length + 1).padStart(3, '0');
  return `PO-${year}-${nextSeq}`;
}

function openCreateModal(): void {
  form.poNumber = generateNextPONumber();
  selectedSupplier.value = suppliers.value[0]?.id ?? null;
  form.note = '';
  formItems.value = [
    {
      selectedProduct: null,
      partNumber: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    },
  ];
  isCreateModalOpen.value = true;
}

function addItemRow(): void {
  formItems.value.push({
    selectedProduct: null,
    partNumber: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
}

function removeItemRow(index: number): void {
  if (formItems.value.length <= 1) return;
  formItems.value.splice(index, 1);
}

function handleProductSelect(index: number, prodOpt: ProductOption | null): void {
  if (prodOpt && formItems.value[index]) {
    formItems.value[index].partNumber = prodOpt.partNumber;
    formItems.value[index].productName = prodOpt.name;
    formItems.value[index].unitPrice = prodOpt.costPrice;
    calcItemTotal(index);
  }
}

function calcItemTotal(index: number): void {
  const item = formItems.value[index];
  if (item) {
    item.totalPrice = (item.quantity || 0) * (item.unitPrice || 0);
  }
}

function normalizeQuantity(index: number): void {
  const item = formItems.value[index];
  if (!item) return;
  if (!item.quantity || item.quantity < 1) {
    item.quantity = 1;
  }
  calcItemTotal(index);
}

const calculatedGrandTotal = computed(() =>
  formItems.value.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
);

const duplicateProductNames = computed(() => {
  const seen = new Map<number, string>();
  const duplicates = new Set<string>();

  formItems.value.forEach((item) => {
    const productId = item.selectedProduct?.value;
    if (!productId) return;

    if (seen.has(productId)) {
      duplicates.add(item.productName || seen.get(productId) || 'สินค้าที่เลือก');
    } else {
      seen.set(productId, item.productName);
    }
  });

  return [...duplicates];
});

const totalPOCount = computed((): number => purchaseOrders.value.length);
const orderedPOCount = computed(
  (): number => purchaseOrders.value.filter((po) => po.status === 'ORDERED').length,
);
const receivedPOCount = computed(
  (): number => purchaseOrders.value.filter((po) => po.status === 'RECEIVED').length,
);

async function savePO(): Promise<void> {
  if (!selectedSupplier.value) return;

  const validItems = formItems.value.filter((item) => item.selectedProduct !== null);
  if (validItems.length === 0) return;

  const items = validItems.map((item) => ({
    productId: item.selectedProduct!.value,
    orderedQty: item.quantity || 1,
    unitCost: item.unitPrice || 0,
  }));

  try {
    await addPO({
      poNumber: form.poNumber,
      supplierId: selectedSupplier.value,
      status: 'ORDERED',
      items,
      note: form.note,
    });

    $q.notify({
      type: 'positive',
      message: 'บันทึกใบสั่งซื้อเรียบร้อยแล้ว',
    });
    isCreateModalOpen.value = false;
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'สร้างใบสั่งซื้อไม่สำเร็จ',
    });
  }
}

function viewPoDetail(po: PurchaseOrder): void {
  selectedPO.value = po;
  isDetailModalOpen.value = true;
}

async function handleStatusChange(id: number, newStatus: PurchaseOrder['status']): Promise<void> {
  try {
    await updatePOStatus(id, newStatus);
    $q.notify({
      type: 'positive',
      message: 'อัปเดตสถานะใบสั่งซื้อเรียบร้อยแล้ว',
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'อัปเดตสถานะไม่สำเร็จ',
    });
  }
}

function getStatusColor(status: PurchaseOrder['status']): string {
  switch (status) {
    case 'RECEIVED':
      return 'positive';
    case 'ORDERED':
      return 'warning';
    case 'DRAFT':
      return 'grey-7';
    case 'CANCELLED':
      return 'negative';
    default:
      return 'grey';
  }
}

function getStatusLabel(status: PurchaseOrder['status']): string {
  switch (status) {
    case 'RECEIVED':
      return 'รับสินค้าแล้ว';
    case 'ORDERED':
      return 'รอสินค้า';
    case 'DRAFT':
      return 'ฉบับร่าง';
    case 'CANCELLED':
      return 'ยกเลิก';
    default:
      return 'ไม่ทราบสถานะ';
  }
}
</script>

<style scoped>
.status-select {
  display: inline-block;
}

.create-po-card {
  width: 800px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
}

.create-po-card__header,
.create-po-card__footer {
  flex: 0 0 auto;
  position: sticky;
  z-index: 1;
}

.create-po-card__header {
  top: 0;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
}

.create-po-card__body {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.create-po-card__footer {
  bottom: 0;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 599px) {
  .full-width-xs {
    width: 100%;
  }
}
</style>
