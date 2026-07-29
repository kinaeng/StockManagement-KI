<template>
  <div class="page-header row items-center justify-between q-mb-md">
    <div>
      <h1 class="page-header__title text-h5 text-sm-h4 text-weight-bold text-primary q-my-none">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="page-header__subtitle text-caption text-sm-subtitle2 text-grey-7 q-mb-none q-mt-xs"
      >
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions" class="q-mt-sm-none q-mt-xs">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
