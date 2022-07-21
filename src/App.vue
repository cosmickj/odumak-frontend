<template>
  <main
    v-if="account.isAuthReady"
    class="min-h-screen flex items-center justify-center sm:bg-gray-200"
  >
    <!-- 450px 이상에서는 아래의 어플 크기로 보이게 한다. -->
    <section
      class="relative flex items-center justify-center w-screen h-screen sm:max-w-xl sm:max-h-240 bg-white shadow-lg"
    >
      <div class="grow h-full flex flex-col justify-center">
        <router-view></router-view>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account';
const account = useAccountStore();
</script>
