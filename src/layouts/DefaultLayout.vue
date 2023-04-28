<template>
  <main class="h-[100svh] flex items-center justify-center sm:bg-gray-200">
    <div
      class="w-full sm:w-[360px] h-full sm:max-h-[640px] bg-slate-100 shadow-lg"
    >
      <div v-if="isAuthReady" class="flex flex-col h-full">
        <RouterView class="overflow-auto flex-1" />
        <RouterView name="GlobalNavbar" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

const { isAuthReady } = storeToRefs(useUserStore());
</script>
