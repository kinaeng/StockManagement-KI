<template>
  <q-chip
    :color="color"
    :text-color="textColor"
    :size="size"
    :outline="outline"
    :dense="dense"
    :icon="icon"
    class="q-ma-none"
  >
    {{ label }}
  </q-chip>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    color?: string;
    textColor?: string;
    size?: string;
    outline?: boolean;
    dense?: boolean;
    icon?: string;
  }>(),
  {
    color: 'primary',
    textColor: 'white',
    size: 'sm',
    outline: false,
    dense: false,
  },
);
</script>
