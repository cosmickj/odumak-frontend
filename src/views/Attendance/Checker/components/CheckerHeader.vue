<template>
  <header class="relative flex items-center justify-center">
    <!-- 뒤로 가기 -->
    <button class="absolute left-0 w-12 h-full cursor-pointer">
      <router-link
        class="flex w-full h-full items-center justify-center"
        :to="{ name: 'HomeView' }"
      >
        <i class="pi pi-arrow-left text-3xl"></i>
      </router-link>
    </button>

    <!-- 메뉴 제목 -->
    <span class="text-3xl">출석 입력하기</span>
  </header>

  <div
    v-if="accountData?.role === 'admin'"
    class="flex mt-5 text-2xl justify-center"
  >
    <div>{{ accountData?.displayName }}</div>
  </div>

  <div
    v-else-if="accountData?.role === 'main' || accountData?.role === 'sub'"
    class="flex mt-5 text-2xl justify-around"
  >
    <div>{{ accountData?.grade }}학년 {{ accountData?.group }}반</div>
    <div>{{ accountData?.displayName }} 선생님</div>
  </div>
</template>

<script setup lang="ts">
import { AccountData } from '@/types/store';

defineProps<{
  accountData: AccountData | null;
}>();
</script>
