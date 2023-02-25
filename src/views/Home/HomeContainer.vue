<template>
  <section class="p-5">
    <header class="mb-5">
      <div class="flex my-2 text-xl items-baseline justify-center">
        <p>
          안녕하세요, <strong>{{ userName }}</strong> 선생님!
        </p>
      </div>

      <RouterLink v-if="isAdmin" :to="{ name: 'AdminStudent' }">
        <div class="text-sm text-amber-500 text-center cursor-pointer">
          <u>관리자 페이지 이동하기</u>
        </div>
      </RouterLink>
    </header>

    <div class="grid gap-3 grid-cols-2 grid-rows-3 h-2/4">
      <HomeMenu
        class="col-start-1 col-end-2 row-start-1 row-end-3 bg-blue-300 text-blue-700"
        job="student"
        type="daily"
        icon="pi pi-users"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="col-start-1 col-end-2 row-start-3 row-end-4 bg-red-300 text-red-700"
        job="student"
        type="total"
        icon="pi pi-users"
        route-name="AttendanceTrackerTotal"
      />

      <HomeMenu
        class="col-start-2 col-end-3 row-start-1 row-end-2 bg-green-300 text-green-700"
        job="teacher"
        type="daily"
        icon="pi pi-heart"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="col-start-2 col-end-3 row-start-2 row-end-4 bg-yellow-300 text-yellow-700"
        job="teacher"
        type="total"
        icon="pi pi-heart"
        route-name="AttendanceTrackerTotal"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import HomeMenu from './components/HomeMenu.vue';

import { computed } from 'vue';
import { useAccountStore } from '@/store/account';

const { accountData } = useAccountStore();

const userName = computed(() => accountData?.displayName);

const isAdmin = computed(() => {
  if (accountData?.role === 'admin') {
    return true;
  }
  return false;
});
</script>
