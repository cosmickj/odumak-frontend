<template>
  <main class="min-h-screen flex items-center justify-center sm:bg-gray-200">
    <section
      v-if="account.isAuthReady"
      class="flex items-center justify-center w-screen h-screen sm:max-w-xl sm:max-h-240 bg-white shadow-lg"
    >
      <div class="grow h-full flex flex-col justify-center">
        <RouterView></RouterView>
        <RouterView name="GlobalNavbar"></RouterView>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account';

const account = useAccountStore();
</script>
