<template>
  <header class="relative flex justify-center items-center">
    <!-- 뒤로 가기 -->
    <button class="h-full w-12 absolute left-0 cursor-pointer">
      <router-link
        class="h-full w-full flex justify-center items-center"
        :to="{ name: 'HomeView' }"
      >
        <i class="pi pi-arrow-left text-3xl"></i>
      </router-link>
    </button>

    <!-- 메뉴 제목 -->
    <span class="text-3xl">출석 입력하기</span>
  </header>

  <div
    v-if="userData?.role === 'teacher'"
    class="flex justify-around text-2xl mt-5"
  >
    <div>{{ userData?.grade }}학년 {{ userData?.group }}반</div>
    <div>{{ userData?.name }} 선생님</div>
  </div>

  <div
    v-else-if="userData?.role === 'admin'"
    class="flex justify-center text-2xl mt-5"
  >
    <div>{{ userData?.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { UserData } from '@/types/store';

const props = defineProps<{
  userData: UserData | null;
}>();
</script>
