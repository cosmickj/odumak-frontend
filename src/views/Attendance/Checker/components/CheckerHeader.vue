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
    v-if="userData?.role === 'admin'"
    class="flex mt-5 text-2xl justify-center"
  >
    <div>{{ userData?.displayName }}</div>
  </div>

  <div
    v-else-if="userData?.role === 'main' || userData?.role === 'sub'"
    class="flex mt-5 text-2xl justify-around"
  >
    <div>{{ userData?.grade }}학년 {{ userData?.group }}반</div>
    <div>{{ userData?.displayName }} 선생님</div>
  </div>
</template>

<script setup lang="ts">
import { _UserData } from '@/store/account';

defineProps<{
  userData: _UserData | null;
}>();
</script>
