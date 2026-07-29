<template>
  <q-page class="q-pa-xs-sm q-pa-md">
    <div class="row items-center justify-between q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-auto">
        <h1 class="text-h5 text-sm-h4 text-weight-bold text-primary q-my-none">จัดการใบสั่งซื้อ (Purchase Orders)</h1>
        <p class="text-caption text-sm-subtitle2 text-grey-7 q-mb-none">
          ติดตามสถานะใบสั่งซื้อสินค้าเข้าคลัง (FR-5.2)
        </p>
      </div>
      <div class="col-12 col-sm-auto text-right">
        <q-btn
          color="primary"
          icon="add_shopping_cart"
          label="สร้างใบสั่งซื้อ (PO)"
          class="full-width-xs"
          @click="isModalOpen = true"
        />
      </div>
    </div>

    <BaseTable
      title="รายการใบสั่งซื้อทั้งหมด"
      :rows="purchaseOrders"
      :columns="columns"
      grid-header
    >
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
              <q-chip :color="getStatusColor(props.row.status)" text-color="white" size="sm" class="q-ma-none cursor-pointer">
                {{ getStatusLabel(props.row.status) }}
                <q-icon name="arrow_drop_down" class="q-ml-xs" />
              </q-chip>
            </template>
          </q-select>
        </q-td>
      </template>
    </BaseTable>

    <BaseModal
      v-model="isModalOpen"
      title="สร้างใบสั่งซื้อสินค้า (PO) ใหม่"
      confirm-label="สร้างใบสั่งซื้อ"
      @confirm="savePO"
    >
      <div class="q-gutter-md">
        <q-input v-model="form.poNumber" outlined dense label="เลขที่ใบสั่งซื้อ (PO Number)" />
        <q-select
          v-model="form.supplierName"
          outlined
          dense
          :options="suppliers.map((s: Supplier) => s.name)"
          label="เลือกผู้จำหน่าย"
        />
        <q-input v-model.number="form.totalAmount" type="number" outlined dense label="ยอดรวมประมาณการ (บาท)" />
      </div>
    </BaseModal>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { useSuppliers, type PurchaseOrder, type Supplier } from '@/composables/use-suppliers';

const { purchaseOrders, suppliers, addPO, updatePOStatus } = useSuppliers();

const statusOptions = [
  { label: 'รับแล้ว', value: 'RECEIVED' },
  { label: 'รอ', value: 'ORDERED' },
];

const columns = [
  { name: 'poNumber', label: 'เลขที่ PO', field: 'poNumber', align: 'left' as const, sortable: true },
  { name: 'supplierName', label: 'ผู้จำหน่าย', field: 'supplierName', align: 'left' as const },
  { name: 'totalAmount', label: 'ยอดรวม (฿)', field: 'totalAmount', align: 'right' as const, sortable: true },
  { name: 'status', label: 'สถานะ (กดเพื่อเปลี่ยน)', field: 'status', align: 'center' as const },
  { name: 'createdAt', label: 'วันที่สั่งซื้อ', field: 'createdAt', align: 'left' as const },
];

const isModalOpen = ref(false);

function generateNextPONumber(): string {
  const year = new Date().getFullYear();
  const nextSeq = String(purchaseOrders.value.length + 1).padStart(3, '0');
  return `PO-${year}-${nextSeq}`;
}

const form = reactive<Omit<PurchaseOrder, 'id' | 'createdAt' | 'status'>>({
  poNumber: generateNextPONumber(),
  supplierName: '',
  totalAmount: 0,
});

function handleStatusChange(id: number, newStatus: PurchaseOrder['status']): void {
  updatePOStatus(id, newStatus);
}

function getStatusColor(status: PurchaseOrder['status']): string {
  switch (status) {
    case 'RECEIVED':
      return 'positive';
    case 'ORDERED':
      return 'warning';
    case 'DRAFT':
      return 'grey';
    case 'CANCELLED':
      return 'negative';
    default:
      return 'grey';
  }
}

function getStatusLabel(status: PurchaseOrder['status']): string {
  switch (status) {
    case 'RECEIVED':
      return 'รับแล้ว';
    case 'ORDERED':
      return 'รอ';
    case 'DRAFT':
      return 'ฉบับร่าง';
    case 'CANCELLED':
      return 'ยกเลิก';
    default:
      return 'ไม่ทราบสถานะ';
  }
}

function savePO(): void {
  addPO({ ...form, status: 'ORDERED' });
  isModalOpen.value = false;
  form.poNumber = generateNextPONumber();
  form.supplierName = '';
  form.totalAmount = 0;
}
</script>

<style scoped>
.status-select {
  display: inline-block;
}

@media (max-width: 599px) {
  .full-width-xs {
    width: 100%;
  }
}
</style>
