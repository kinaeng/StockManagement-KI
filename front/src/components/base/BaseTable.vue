<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div class="text-h6 text-weight-bold text-primary">{{ title }}</div>
      <div class="row q-gutter-sm">
        <q-input
          v-if="showSearch"
          v-model="filter"
          dense
          outlined
          placeholder="ค้นหา..."
          aria-label="ค้นหาข้อมูลในตาราง"
          class="bg-white"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <slot name="actions"></slot>
      </div>
    </q-card-section>

    <q-card-section>
      <q-table
        v-model:pagination="pagination"
        flat
        bordered
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        row-key="id"
        no-data-label="ไม่พบข้อมูล"
        loading-label="กำลังโหลดข้อมูล..."
      >
        <template #loading>
          <div class="row items-center justify-center q-pa-xl full-width" role="status" aria-live="polite">
            <q-spinner color="primary" size="32px" aria-hidden="true" />
            <span class="q-ml-sm text-body">กำลังโหลดข้อมูล...</span>
          </div>
        </template>

        <template #no-data>
          <div class="empty-state q-pa-xl text-center full-width" role="status">
            <q-icon name="inventory_2" size="56px" color="grey-5" />
            <div class="empty-state__title q-mt-md">ไม่พบข้อมูลที่ค้นหา</div>
            <div class="empty-state__caption">ลองปรับคำค้นหาหรือตัวกรอง แล้วค้นหาอีกครั้ง</div>
          </div>
        </template>

        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

interface Props {
  title?: string;
  rows: T[];
  columns: QTableProps['columns'];
  loading?: boolean;
  showSearch?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: '',
  loading: false,
  showSearch: true,
});

const filter = ref('');
const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
</script>

<style scoped>
.empty-state {
  min-height: 220px;
  color: var(--color-text-muted);
}

.empty-state__title {
  color: var(--color-text-main);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.empty-state__caption {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
