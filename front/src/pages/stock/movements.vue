<template>
  <q-page class="q-pa-lg">
    <BasePageHeader
      title="ประวัติการเคลื่อนไหวสต็อก (Stock Movement Log)"
      subtitle="ตรวจสอบประวัติการรับ-จ่าย และการปรับปรุงสต็อกสินค้าทั้งหมด (FR-3.5)"
    />

    <!-- Filters -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-sm items-center q-py-sm">
        <div class="col-12 col-sm-4">
          <q-select
            v-model="filterType"
            outlined
            dense
            clearable
            :options="typeOptions"
            option-label="label"
            option-value="value"
            label="ประเภทรายการ"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input
            v-model="filterDate"
            outlined
            dense
            readonly
            clearable
            label="วันที่"
            placeholder="เลือกวันที่"
            :display-value="formatDate(filterDate)"
            aria-label="เลือกวันที่สำหรับกรองประวัติการเคลื่อนไหว"
          >
            <template #prepend>
              <q-icon name="calendar_month" aria-hidden="true" />
            </template>
            <q-popup-proxy
              ref="datePickerRef"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="filterDate"
                mask="YYYY-MM-DD"
                today-btn
                @update:model-value="onDateSelected"
              />
            </q-popup-proxy>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <BaseTable title="ประวัติรายการย้อนหลัง" :rows="filteredMovements" :columns="columns" :loading="isLoading">
      <template #body-cell-type="props">
        <q-td :props="props">
          <q-chip
            :color="getTypeColor(props.row.type)"
            text-color="white"
            size="sm"
            class="text-weight-bold"
          >
            {{ getTypeLabel(props.row.type) }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-quantity="props">
        <q-td :props="props">
          <span
            :class="{
              'text-positive text-weight-bold': props.row.type === 'IN',
              'text-negative text-weight-bold': props.row.type === 'OUT',
              'text-warning text-weight-bold': props.row.type === 'ADJUST',
            }"
          >
            {{ props.row.type === 'IN' ? '+' : props.row.type === 'OUT' ? '-' : ''
            }}{{ props.row.quantity }}
          </span>
        </q-td>
      </template>
    </BaseTable>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BasePageHeader from '@/components/base/BasePageHeader.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { useStock, type MovementType, type StockMovement } from '@/composables/use-stock';

const { stockMovements, isLoading, loadStockMovements } = useStock();

onMounted(async () => {
  try {
    await loadStockMovements();
  } catch (err) {
    console.error('Failed to load stock movements:', err);
  }
});

const filterType = ref<MovementType | null>(null);
const filterDate = ref<string | null>(null);
const datePickerRef = ref();

const typeOptions = [
  { label: 'รับเข้า (IN)', value: 'IN' },
  { label: 'จ่ายออก (OUT)', value: 'OUT' },
  { label: 'ปรับปรุงสต็อก (ADJUST)', value: 'ADJUST' },
];

function formatDate(date: string | null): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function onDateSelected(): void {
  datePickerRef.value?.hide();
}

const columns = [
  {
    name: 'createdAt',
    label: 'วันที่/เวลา',
    field: 'createdAt',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'type', label: 'ประเภทรายการ', field: 'type', align: 'center' as const },
  { name: 'partNumber', label: 'รหัสสินค้า', field: 'partNumber', align: 'left' as const },
  { name: 'productName', label: 'ชื่อสินค้า', field: 'productName', align: 'left' as const },
  { name: 'quantity', label: 'จำนวน', field: 'quantity', align: 'left' as const },
  { name: 'refDocument', label: 'เอกสารอ้างอิง', field: 'refDocument', align: 'left' as const },
  { name: 'createdBy', label: 'ผู้ทำรายการ', field: 'createdBy', align: 'left' as const },
  { name: 'note', label: 'หมายเหตุ', field: 'note', align: 'left' as const },
];

const filteredMovements = computed(() =>
  stockMovements.value.filter((m: StockMovement) => {
    if (filterType.value && m.type !== filterType.value) return false;
    if (filterDate.value && !m.createdAt.startsWith(filterDate.value)) return false;
    return true;
  }),
);

function getTypeColor(type: MovementType): string {
  switch (type) {
    case 'IN':
      return 'positive';
    case 'OUT':
      return 'negative';
    case 'ADJUST':
      return 'warning';
    default:
      return 'grey';
  }
}

function getTypeLabel(type: MovementType): string {
  switch (type) {
    case 'IN':
      return 'รับเข้า (IN)';
    case 'OUT':
      return 'จ่ายออก (OUT)';
    case 'ADJUST':
      return 'ปรับปรุงสต็อก';
    default:
      return 'อื่นๆ';
  }
}
</script>
