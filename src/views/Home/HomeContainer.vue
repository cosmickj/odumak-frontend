<template>
  <section class="p-4">
    <header class="mb-8 text-xl">
      <p>안녕하세요!</p>
      <div class="flex items-center justify-between">
        <span>
          <strong>{{ userStore.userData?.name }}</strong> 선생님
        </span>

        <AppChipNaver v-if="userStore.userData?.provider === 'naver'" />
        <AppChipKakao v-else-if="userStore.userData?.provider === 'kakao'" s />
      </div>
    </header>

    <div class="flex flex-col gap-2">
      <div
        v-if="userStore.userData?.role.system === 'admin'"
        class="cursor-pointer rounded-lg shadow-sm bg-gradient-to-r from-blue-400 to-emerald-400"
        @click="router.push({ name: 'AdminStudent' })"
      >
        <div class="z-10 relative flex px-4 py-2 items-center justify-between">
          <div>
            <p class="text-lg">관리자 페이지 이동하기</p>
            <p class="text-gray-800 text-sm">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>

          <i class="pi pi-angle-right" style="font-size: 1.5rem"></i>
        </div>
      </div>

      <div>
        <div
          class="z-10 relative flex p-2 rounded-lg bg-white items-center shadow-lg"
        >
          <Avatar :image="bgChild" size="xlarge" shape="circle" />

          <div class="ml-6">
            <p class="text-xl">학생 출석부</p>
            <p class="text-gray-500 text-sm">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>
        </div>

        <div class="flex justify-center translate-y-[-5px]">
          <Button
            class="w-full rounded-none rounded-bl-lg p-button-blue"
            label="일일 현황"
            @click="move('AttendanceTrackerDailyStudent')"
          />
          <Button
            class="w-full rounded-none rounded-br-lg p-button-yellow"
            label="누적 현황"
            @click="move('AttendanceTrackerTotal', 'student')"
          />
        </div>
      </div>

      <div>
        <div
          class="z-10 relative flex p-2 rounded-lg bg-white items-center shadow-lg"
        >
          <Avatar :image="bgMan" size="xlarge" shape="circle" />

          <div class="ml-6">
            <p class="text-xl">교사 출석부</p>
            <p class="text-gray-500 text-sm">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>
        </div>

        <div class="flex justify-center translate-y-[-5px]">
          <Button
            class="w-full rounded-none rounded-bl-lg p-button-blue"
            label="일일 현황"
            @click="move('AttendanceTrackerDailyTeacher')"
          />
          <Button
            class="w-full rounded-none rounded-br-lg p-button-yellow"
            label="누적 현황"
            @click="move('AttendanceTrackerTotal', 'teacher')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppChipKakao from '@/components/AppChipKakao.vue';
import AppChipNaver from '@/components/AppChipNaver.vue';
import bgChild from '@/assets/images/bg-home-child.png';
import bgMan from '@/assets/images/bg-home-man.png';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import type { Job } from '@/types';

const userStore = useUserStore();

const router = useRouter();
const move = (routeName: string, job?: Job) => {
  if (job) {
    return router.push({ name: routeName, params: { job } });
  }
  return router.push({ name: routeName });
};
</script>
