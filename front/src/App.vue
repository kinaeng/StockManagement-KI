<template>
  <router-view />
</template>

<script setup lang="ts">
// Import test utilities in development mode
if (process.env.NODE_ENV === 'development') {
  import('@/utils/autoLinkTestUtils')
    .then(() => {
      console.log('🧪 AutoLink test utilities loaded for development');
      console.log('📖 Use window.autoLinkTest.* to test auto-link suggestions');
    })
    .catch((error) => {
      console.warn('Failed to load test utilities:', error);
    });
}
</script>
