<template>
  <div class="overflow-auto h-[calc(100%_-_6rem)] bg-slate-100">
    <div class="p-5">
      <div class="text-2xl">안녕하세요,</div>
      <div class="flex mt-2 text-3xl items-baseline">
        {{ userName }} 선생님!

        <router-link
          v-if="isAdmin"
          :to="{ name: 'AdminView', params: { position: 'student' } }"
        >
          <div class="ml-5 text-lg text-amber-500 cursor-pointer">
            <u>관리자 페이지 이동하기</u>
          </div>
        </router-link>
      </div>
      <div class="text-red-500">22.08.17 기준 업데이트 완료</div>
    </div>

    <div class="p-5">
      <div class="flex pb-2">
        <!-- 학생 일일 출석 현황 -->
        <HomeMenu
          icon="pi-users"
          route-name="AttendanceTracker"
          position="student"
          type="daily"
        />
        <!-- 학생 누적 출석 현황 -->
        <HomeMenu
          icon="pi-users"
          route-name="AttendanceTracker"
          position="student"
          type="total"
        />
      </div>

      <div class="flex pt-2">
        <!-- 교사 일일 출석 현황 -->
        <HomeMenu
          icon="pi-heart"
          route-name="AttendanceTracker"
          position="teacher"
          type="daily"
        />
        <!-- 교사 누적 출석 현황 -->
        <HomeMenu
          icon="pi-heart"
          route-name="AttendanceTracker"
          position="teacher"
          type="total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeMenu from './components/HomeMenu.vue';
import { computed } from 'vue';
import { useAccountStore } from '@/store/account';

const account = useAccountStore();

const userName = computed(() => account.userData?.name);
const isAdmin = computed(() => {
  if (account.userData?.role === 'admin') {
    return true;
  } else {
    return false;
  }
});
</script>
