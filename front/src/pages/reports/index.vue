<template>
  <q-page class="q-pa-lg">
    <BasePageHeader
      title="ระบบรายงานและวิเคราะห์ (Reports & Analytics)"
      subtitle="ออกรายงานสินค้าคงคลัง สินค้าเคลื่อนไหวเร็ว/ช้า และประเมินมูลค่าสินค้าคงคลัง (FR-6.1 - FR-6.4)"
    />

    <!-- Report Selector Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card
          flat
          bordered
          class="cursor-pointer transition-all"
          :class="{ 'border-primary shadow-sm': activeReport === 'onHand' }"
          @click="activeReport = 'onHand'"
        >
          <q-card-section class="row items-center">
            <q-icon name="inventory" size="36px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-subtitle1 text-weight-bold">รายงานสินค้าคงคลังปัจจุบัน</div>
              <div class="text-caption text-grey-7">Stock on Hand Report (FR-6.1)</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card
          flat
          bordered
          class="cursor-pointer transition-all"
          :class="{ 'border-positive shadow-sm': activeReport === 'movement' }"
          @click="activeReport = 'movement'"
        >
          <q-card-section class="row items-center">
            <q-icon name="trending_up" size="36px" color="positive" class="q-mr-md" />
            <div>
              <div class="text-subtitle1 text-weight-bold">รายงานสินค้าเคลื่อนไหว เร็ว/ช้า</div>
              <div class="text-caption text-grey-7">Fast / Slow Moving (FR-6.2)</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card
          flat
          bordered
          class="cursor-pointer transition-all"
          :class="{ 'border-purple shadow-sm': activeReport === 'valuation' }"
          @click="activeReport = 'valuation'"
        >
          <q-card-section class="row items-center">
            <q-icon name="account_balance_wallet" size="36px" color="purple" class="q-mr-md" />
            <div>
              <div class="text-subtitle1 text-weight-bold">รายงานมูลค่าสินค้าคงคลัง</div>
              <div class="text-caption text-grey-7">Stock Valuation Report (FR-6.4)</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Report Summary Card for Stock Valuation -->
    <q-card flat bordered class="q-mb-md bg-purple-1" v-if="activeReport === 'valuation'">
      <q-card-section class="row items-center justify-between">
        <div class="row items-center">
          <q-icon name="payments" color="purple" size="28px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold text-purple-9">
            สรุปมูลค่ารวมสินค้าคงคลังทั้งหมด (ราคาทุน): ฿{{ totalValuationCost.toLocaleString() }}
          </div>
        </div>
        <div class="text-subtitle2 text-purple-8">
          มูลค่าประเมินราคาขาย: ฿{{ totalValuationSale.toLocaleString() }}
        </div>
      </q-card-section>
    </q-card>

    <!-- Report Output Display Table -->
    <BaseTable :title="reportTitle" :rows="reportData" :columns="activeColumns">
      <template #actions>
        <q-btn
          color="secondary"
          icon="download"
          label="ส่งออก Excel / PDF"
          dense
          no-caps
          unelevated
          class="q-px-sm"
          @click="exportReport"
        />
      </template>

      <template #body-cell-turnoverStatus="props" v-if="activeReport === 'movement'">
        <q-td :props="props">
          <q-chip
            :color="props.row.turnoverStatus === 'Fast' ? 'positive' : 'warning'"
            text-color="white"
            size="sm"
          >
            {{
              props.row.turnoverStatus === 'Fast' ? 'หมุนเวียนเร็ว (Fast)' : 'หมุนเวียนช้า (Slow)'
            }}
          </q-chip>
        </q-td>
      </template>
    </BaseTable>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BasePageHeader from '@/components/base/BasePageHeader.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { useProducts, type Product } from '@/composables/use-products';

const activeReport = ref<'onHand' | 'movement' | 'valuation'>('onHand');
const { products } = useProducts();

const reportTitle = computed((): string => {
  switch (activeReport.value) {
    case 'onHand':
      return 'รายงานสินค้าคงคลังปัจจุบัน (Stock on Hand)';
    case 'movement':
      return 'รายงานวิเคราะห์สินค้าเคลื่อนไหวเร็ว/ช้า (Fast & Slow Moving)';
    case 'valuation':
      return 'รายงานประเมินมูลค่าสต็อกสินค้าคงคลัง (Stock Valuation)';
  }
});

const onHandColumns = [
  {
    name: 'partNumber',
    label: 'รหัสสินค้า',
    field: 'partNumber',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' as const, sortable: true },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left' as const },
  { name: 'brand', label: 'ยี่ห้อ', field: 'brand', align: 'left' as const },
  {
    name: 'stockQty',
    label: 'จำนวนคงเหลือ',
    field: 'stockQty',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'reorderPoint',
    label: 'จุดสั่งซื้อ (Min)',
    field: 'reorderPoint',
    align: 'left' as const,
  },
];

const movementColumns = [
  {
    name: 'partNumber',
    label: 'รหัสสินค้า',
    field: 'partNumber',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' as const, sortable: true },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left' as const },
  { name: 'stockQty', label: 'คงเหลือปัจจุบัน', field: 'stockQty', align: 'left' as const },
  {
    name: 'sales30Days',
    label: 'ยอดจ่ายออก (30 วัน)',
    field: 'sales30Days',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'turnoverStatus',
    label: 'สถานะหมุนเวียน',
    field: 'turnoverStatus',
    align: 'center' as const,
  },
];

const valuationColumns = [
  {
    name: 'partNumber',
    label: 'รหัสสินค้า',
    field: 'partNumber',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' as const, sortable: true },
  { name: 'costPrice', label: 'ราคาทุน/ชิ้น (฿)', field: 'costPrice', align: 'left' as const },
  { name: 'salePrice', label: 'ราคาขาย/ชิ้น (฿)', field: 'salePrice', align: 'left' as const },
  { name: 'stockQty', label: 'จำนวนคงเหลือ', field: 'stockQty', align: 'left' as const },
  {
    name: 'totalCostValue',
    label: 'มูลค่าทุนรวม (฿)',
    field: 'totalCostValue',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'totalSaleValue',
    label: 'มูลค่าขายรวม (฿)',
    field: 'totalSaleValue',
    align: 'left' as const,
    sortable: true,
  },
];

const activeColumns = computed(() => {
  switch (activeReport.value) {
    case 'onHand':
      return onHandColumns;
    case 'movement':
      return movementColumns;
    case 'valuation':
      return valuationColumns;
  }
});

const reportData = computed(() => {
  switch (activeReport.value) {
    case 'onHand':
      return products.value;
    case 'movement':
      return products.value.map((p: Product) => ({
        ...p,
        sales30Days: p.id % 2 === 1 ? 48 : 5,
        turnoverStatus: p.id % 2 === 1 ? 'Fast' : 'Slow',
      }));
    case 'valuation':
      return products.value.map((p: Product) => ({
        ...p,
        totalCostValue: p.costPrice * p.stockQty,
        totalSaleValue: p.salePrice * p.stockQty,
      }));
  }
});

const totalValuationCost = computed((): number =>
  products.value.reduce((sum, p) => sum + p.costPrice * p.stockQty, 0),
);

const totalValuationSale = computed((): number =>
  products.value.reduce((sum, p) => sum + p.salePrice * p.stockQty, 0),
);

function exportReport(): void {
  alert(`กำลังส่งออก ${reportTitle.value} (จำลองการดาวน์โหลดไฟล์ Excel/PDF)`);
}
</script>
