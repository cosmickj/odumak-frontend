<template>
  <section class="flex flex-col px-5 py-8">
    <header class="flex text-xl items-baseline justify-center">
      안녕하세요, <strong>{{ accountName }}</strong> 선생님!
    </header>

    <div class="grid gap-3 grid-cols-2 mt-5">
      <HomeMenu
        class="bg-blue-300 text-blue-700"
        job="student"
        type="daily"
        icon="pi pi-users"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-red-300 text-red-700"
        job="student"
        type="total"
        icon="pi pi-users"
        route-name="AttendanceTrackerTotal"
      />

      <HomeMenu
        class="bg-green-300 text-green-700"
        job="teacher"
        type="daily"
        icon="pi pi-heart"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-yellow-300 text-yellow-700"
        job="teacher"
        type="total"
        icon="pi pi-heart"
        route-name="AttendanceTrackerTotal"
      />

      <RouterLink
        v-if="isAdmin"
        :to="{ name: 'AdminStudent' }"
        class="col-span-2 py-3 bg-stone-300 rounded-lg flex items-center justify-center"
      >
        <div>관리자 페이지 이동하기</div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import HomeMenu from './components/HomeMenu.vue';

import { computed } from 'vue';
import { useAccountStore } from '@/store/account';

const { accountData } = useAccountStore();

const accountName = computed(() => accountData?.name);

const isAdmin = computed(() => {
  if (accountData?.role === 'admin') {
    return true;
  }
  return false;
});
</script>
