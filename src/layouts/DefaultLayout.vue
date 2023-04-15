<template>
  <main class="h-[100svh] sm:bg-gray-200">
    <div class="sm:max-w-[360px] h-full mx-auto bg-slate-100 shadow-lg">
      <div v-if="isAuthReady" class="flex flex-col h-full">
        <RouterView class="overflow-auto flex-1" />
        <RouterView name="GlobalNavbar" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/store/account';

const { isAuthReady } = storeToRefs(useAccountStore());
</script>
