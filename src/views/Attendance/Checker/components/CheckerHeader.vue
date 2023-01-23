<template>
  <header class="relative flex items-center justify-center">
    <!-- 뒤로 가기 -->
    <button class="absolute left-0 w-12 h-full cursor-pointer">
      <RouterLink
        class="flex w-full h-full items-center justify-center"
        :to="{ name: 'HomeView' }"
      >
        <i class="pi pi-arrow-left text-3xl"></i>
      </RouterLink>
    </button>

    <!-- 메뉴 제목 -->
    <span class="text-3xl">출석 체크</span>
  </header>

  <!-- <div
    v-if="account.role === 'admin'"
    class="flex mt-5 text-2xl justify-center"
  >
    <div>{{ account.displayName }}</div>
  </div>

  <div v-else class="flex mt-5 text-2xl justify-around">
    <div>{{ account.grade }}학년 {{ account.group }}반</div>
    <div>{{ account.displayName }} 선생님</div>
  </div> -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from '@/store/account';

const accountStore = useAccountStore();
const account = computed(() => accountStore.accountData!);
</script>
