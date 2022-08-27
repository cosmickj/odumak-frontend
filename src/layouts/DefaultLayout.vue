<template>
  <main class="h-screen flex sm:bg-gray-200 items-center justify-center">
    <div class="w-full sm:max-w-xl h-full sm:max-h-240 bg-slate-100 shadow-lg">
      <div v-if="account.isAuthReady" class="flex flex-col h-full">
        <RouterView class="grow"></RouterView>
        <RouterView name="GlobalNavbar"></RouterView>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account';

const account = useAccountStore();
</script>
