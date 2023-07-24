<template>
  <RouterView v-if="isAuthReady" />

  <div v-else class="flex h-screen items-center justify-center">
    <ProgressSpinner stroke-width="3" animation-duration="1.5s" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

const { isAuthReady } = storeToRefs(useUserStore());
</script>
