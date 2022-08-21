<template>
  <section class="p-5">
    <header class="mb-5">
      <div class="flex my-2 text-3xl items-baseline justify-center">
        안녕하세요,&nbsp;
        <strong>{{ userName }}</strong> &nbsp;선생님!
      </div>

      <RouterLink
        v-if="isAdmin"
        :to="{ name: 'AdminView', params: { position: 'student' } }"
      >
        <div class="text-lg text-amber-500 text-center cursor-pointer">
          <u>관리자 페이지 이동하기</u>
        </div>
      </RouterLink>
    </header>

    <div class="grid gap-4 grid-cols-2 grid-rows-2">
      <!-- 학생 일일 출석 현황 -->
      <HomeMenu
        icon="pi pi-users"
        route-name="AttendanceTracker"
        position="student"
        type="daily"
      />
      <!-- 학생 누적 출석 현황 -->
      <HomeMenu
        icon="pi pi-users"
        route-name="AttendanceTracker"
        position="student"
        type="total"
      />
      <!-- 교사 일일 출석 현황 -->
      <HomeMenu
        icon="pi pi-heart"
        route-name="AttendanceTracker"
        position="teacher"
        type="daily"
      />
      <!-- 교사 누적 출석 현황 -->
      <HomeMenu
        icon="pi pi-heart"
        route-name="AttendanceTracker"
        position="teacher"
        type="total"
      />
    </div>

    <p class="mt-20 text-2xl text-red-500 text-center">
      22. 08. 21 기준 업데이트 완료
    </p>
  </section>
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
