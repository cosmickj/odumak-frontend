<template>
  <section class="px-5 py-8">
    <header class="mb-4 text-xl text-center">
      안녕하세요, <strong>{{ accountName }}</strong> 선생님!
    </header>

    <div class="grid grid-cols-2 gap-3">
      <RouterLink
        v-if="isAdmin"
        :to="{ name: 'AdminStudent' }"
        class="col-span-2 bg-purple-300 text-purple-700 rounded-lg"
      >
        <div class="relative w-full h-full py-6 text-center">
          <p><span class="font-bold">관리자 페이지</span> 이동하기</p>
          <span class="absolute bottom-4 right-4">
            <i class="pi pi-angle-right"></i>
          </span>
        </div>
      </RouterLink>

      <HomeMenu
        class="bg-blue-300 text-blue-700"
        job="student"
        type="daily"
        icon="pi pi-users"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-green-300 text-green-700"
        job="teacher"
        type="daily"
        icon="pi pi-heart"
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
        class="bg-yellow-300 text-yellow-700"
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

const accountName = computed(() => accountData?.name);

const isAdmin = computed(() => {
  if (accountData?.role === 'admin') {
    return true;
  }
  return false;
});
</script>
