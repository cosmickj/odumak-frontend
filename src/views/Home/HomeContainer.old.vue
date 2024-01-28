<template>
  <section class="p-6">
    <header class="mb-6 flex">
      <Avatar :image="userStore.userData?.profileImage" size="large" shape="circle" />

      <div class="ml-2 sm:ml-4">
        <p class="text-sm text-gray-600">안녕하세요,</p>
        <p class="text-lg">
          <strong>{{ userStore.userData?.name }}</strong> 선생님!
        </p>
      </div>

      <Avatar
        class="ml-auto cursor-pointer bg-slate-300"
        icon="pi pi-bars"
        size="large"
        @click="menuVisible = true"
      />
    </header>

    <Sidebar class="p-sidebar-home" v-model:visible="menuVisible" position="right">
      <Menu class="p-menu-home w-full text-lg" :model="items">
        <template #item="{ item, props }">
          <RouterLink v-slot="{ href, navigate }" :to="item.route">
            <a v-bind="props.action" class="bg-slate-300" :href="href" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-4">{{ item.label }}</span>
            </a>
          </RouterLink>
        </template>
      </Menu>
    </Sidebar>

    <div class="flex flex-col gap-4">
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

      <div class="rounded-lg bg-white p-4 shadow-lg">
        <div class="flex items-center pb-2">
          <Avatar :image="bgChild" size="xlarge" shape="circle" />

          <div class="ml-6">
            <p class="text-xl">학생 정보</p>
            <p class="text-sm text-gray-500">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <Button
            class="p-button-blue flex-1 rounded-md py-1 text-white"
            label="일일 출석 현황"
            @click="move('AttendanceTrackerDailyStudent')"
          />
          <!-- <Button
            disabled
            class="p-button-yellow flex-1 rounded-md py-1"
            label="누적 출석 현황"
            @click="move('AttendanceTrackerTotal', 'student')"
          /> -->
        </div>
      </div>

      <div class="rounded-lg bg-white p-4 shadow-lg">
        <div class="flex items-center pb-2">
          <Avatar :image="bgMan" size="xlarge" shape="circle" />

          <div class="ml-6">
            <p class="text-xl">교사 정보</p>
            <p class="text-sm text-gray-500">
              {{ userStore.userData?.church }}
              {{ userStore.userData?.department }}
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <Button
            disabled
            class="p-button-blue flex-1 rounded-md py-1 text-white"
            label="준비중입니다"
            @click="move('AttendanceTrackerDailyTeacher')"
          />
          <!-- <Button
            disabled
            class="p-button-blue flex-1 rounded-md py-1 text-white"
            label="일일 현황"
            @click="move('AttendanceTrackerDailyTeacher')"
          />
          <Button
            disabled
            class="p-button-yellow flex-1 rounded-md py-1"
            label="누적 현황"
            @click="move('AttendanceTrackerTotal', 'teacher')"
          /> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Job } from '@/types';
import { useUserStore } from '@/stores/user';
import bgChild from '@/assets/images/bg-home-child.png';
import bgMan from '@/assets/images/bg-home-man.png';

const router = useRouter();
const userStore = useUserStore();

const menuVisible = ref(false);

const items = ref([{ label: '내 정보 보기', icon: 'pi pi-user', route: '/user' }]);

const move = (routeName: string, job?: Job) => {
  if (job) {
    // return router.push({ name: routeName, params: { job } });
    return router.push({ name: routeName });
  }
  return router.push({ name: routeName });
};
</script>

<style>
.p-sidebar-home .p-sidebar-header {
  @apply p-6 pb-2;
}
.p-sidebar-home .p-sidebar-header button {
  @apply h-12 w-12;
}
.p-sidebar-home .p-sidebar-header button svg {
  @apply h-6 w-6;
}
.p-menu-home .p-menuitem:not(:last-child) {
  @apply border-b;
}
</style>
