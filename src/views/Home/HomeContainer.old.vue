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
        class="cursor-pointer rounded-lg bg-gradient-to-r from-blue-400 to-emerald-400 shadow-sm"
        @click="router.push({ name: 'AdminStudent' })"
      >
        <div class="relative z-10 flex items-center justify-between px-4 py-2">
          <div>
            <p class="text-lg">관리자 페이지 이동하기</p>
            <p class="text-sm text-gray-800">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>

          <i class="pi pi-angle-right" style="font-size: 1.5rem"></i>
        </div>
      </div>

      <div>
        <div class="relative z-10 flex items-center rounded-lg bg-white p-2 shadow-lg">
          <Avatar :image="bgChild" size="xlarge" shape="circle" />

          <div class="ml-6">
            <p class="text-xl">학생 출석부</p>
            <p class="text-sm text-gray-500">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>
        </div>

        <div class="flex translate-y-[-5px] justify-center">
          <Button
            class="p-button-blue w-full rounded-none rounded-bl-lg"
            label="일일 현황"
            @click="move('AttendanceTrackerDailyStudent')"
          />
          <Button
            class="p-button-yellow w-full rounded-none rounded-br-lg"
            label="누적 현황"
            @click="move('AttendanceTrackerTotal', 'student')"
          />
        </div>
      </div>

      <div>
        <div class="relative z-10 flex items-center rounded-lg bg-white p-2 shadow-lg">
          <Avatar :image="bgMan" size="xlarge" shape="circle" />

          <div class="ml-6">
            <p class="text-xl">교사 출석부</p>
            <p class="text-sm text-gray-500">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>
        </div>

        <div class="flex translate-y-[-5px] justify-center">
          <Button
            class="p-button-blue w-full rounded-none rounded-bl-lg"
            label="일일 현황"
            @click="move('AttendanceTrackerDailyTeacher')"
          />
          <Button
            class="p-button-yellow w-full rounded-none rounded-br-lg"
            label="누적 현황"
            @click="move('AttendanceTrackerTotal', 'teacher')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Job } from '@/types';
import { useUserStore } from '@/store/user';
import AppChipKakao from '@/components/AppChipKakao.vue';
import AppChipNaver from '@/components/AppChipNaver.vue';
import bgChild from '@/assets/images/bg-home-child.png';
import bgMan from '@/assets/images/bg-home-man.png';

const userStore = useUserStore();

const router = useRouter();
const move = (routeName: string, job?: Job) => {
  if (job) {
    return router.push({ name: routeName, params: { job } });
  }
  return router.push({ name: routeName });
};
</script>
