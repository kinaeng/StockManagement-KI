<template>
  <q-page class="q-pa-lg">
    <!-- Page Header -->
    <div class="page-header row items-center justify-between">
      <div>
        <h1 class="page-header__title">แจ้งเตือนสต็อกต่ำ (Low Stock Alerts)</h1>
        <p class="page-header__subtitle">
          รายการสินค้าที่จำนวนคงเหลือต่ำกว่าจุดสั่งซื้อเพิ่ม (Reorder Point) (FR-4.1, FR-4.2)
        </p>
      </div>
      <q-btn
        color="negative"
        icon="add_shopping_cart"
        label="สร้าง PO รวมจากรายการเตือน"
        no-caps
        unelevated
        to="/purchase-orders"
      />
    </div>

    <!-- Low Stock Table -->
    <BaseTable
      title="สินค้าที่ต้องสั่งซื้อด่วน"
      :rows="lowStockProducts"
      :columns="columns"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip color="negative" text-color="white" size="sm" icon="priority_high">
            ต่ำกว่าจุดสั่งซื้อ
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-shortage="props">
        <q-td :props="props" align="right">
          <span class="text-weight-bold text-negative">
            {{ Math.max(0, props.row.reorderPoint - props.row.stockQty) }} ชิ้น
          </span>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" align="right">
          <q-btn
            color="primary"
            size="sm"
            dense
            icon="shopping_cart"
            label="สั่งซื้อ (PO)"
            no-caps
            to="/purchase-orders"
          />
        </q-td>
      </template>
    </BaseTable>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { useProducts, type Product } from '@/composables/use-products';

const { products } = useProducts();

const columns = [
  { name: 'partNumber', label: 'รหัสสินค้า (Part No.)', field: 'partNumber', align: 'left' as const, sortable: true },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' as const, sortable: true },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left' as const },
  { name: 'stockQty', label: 'คงเหลือปัจจุบัน', field: 'stockQty', align: 'right' as const, sortable: true },
  { name: 'reorderPoint', label: 'จุดสั่งซื้อ (Min)', field: 'reorderPoint', align: 'right' as const, sortable: true },
  { name: 'shortage', label: 'จำนวนขาด', field: 'shortage', align: 'right' as const },
  { name: 'status', label: 'สถานะ', field: 'status', align: 'center' as const },
  { name: 'actions', label: 'ดำเนินการ', field: 'actions', align: 'right' as const },
];

const lowStockProducts = computed((): Product[] =>
  products.value.filter((p: Product) => p.stockQty <= p.reorderPoint),
);
</script>
