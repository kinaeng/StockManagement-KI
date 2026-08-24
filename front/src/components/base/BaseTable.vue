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
