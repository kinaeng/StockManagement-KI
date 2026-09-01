<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card :style="{ minWidth: width }">
      <q-card-section class="row items-center bg-primary text-white">
        <div class="text-h6 text-weight-bold">{{ title }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense>
          <q-tooltip>ปิด</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <slot></slot>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-2">
        <q-btn outline label="ยกเลิก" color="primary" v-close-popup />
        <q-btn
          v-if="showConfirm"
          :label="confirmLabel"
          color="primary"
          :loading="loading"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  title: string;
  width?: string;
  confirmLabel?: string;
  showConfirm?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: '500px',
  confirmLabel: 'บันทึก',
  showConfirm: true,
  loading: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

const isOpen = computed({
  get: (): boolean => props.modelValue,
  set: (val: boolean): void => emit('update:modelValue', val),
});

function onConfirm(): void {
  emit('confirm');
}
</script>
