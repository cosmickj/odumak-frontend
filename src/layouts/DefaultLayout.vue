<template>
  <main class="h-[100svh] flex sm:bg-gray-200 items-center justify-center">
    <div
      class="w-full sm:max-w-sm h-full sm:max-h-[46rem] bg-slate-100 shadow-lg"
    >
      <div v-if="account.isAuthReady" class="flex flex-col h-full">
        <RouterView class="grow" />
        <RouterView name="GlobalNavbar" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account';

const account = useAccountStore();
</script>
