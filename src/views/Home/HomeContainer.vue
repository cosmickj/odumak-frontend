<template>
  <section class="px-5 py-8">
    <header class="mb-4 text-xl">
      <p>안녕하세요!</p>
      <div class="flex items-center justify-between">
        <p>
          <strong>{{ accountData?.name }}</strong> 선생님
        </p>

        <RouterLink
          v-if="!accountData?.isAccepted"
          :to="{ name: 'UserEditView' }"
        >
          <Button
            class="text-xs"
            icon="pi pi-plus"
            label="추가 정보 입력하기"
            severity="danger"
            outlined
          />
        </RouterLink>

        <Dialog
          modal
          v-model:visible="visible"
          class="w-1/3"
          position="bottom"
          header="승인이 필요합니다"
          :breakpoints="{ '640px': '90vw' }"
        >
          <div class="break-keep">
            <span class="font-semibold">
              추가정보(교회, 당담부서, 학급 등)
            </span>
            를 입력해주세요.
          </div>

          <template #footer>
            <RouterLink :to="{ name: 'UserEditView' }">
              <Button
                autofocus
                outlined
                class="text-xs"
                icon="pi pi-plus"
                label="추가 정보 입력하기"
                severity="danger"
              />
            </RouterLink>
          </template>
        </Dialog>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3">
      <RouterLink
        v-if="accountData?.role === 'admin'"
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
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useAccountStore } from '@/store/account';

const { accountData } = useAccountStore();

const visible = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if ((to.name as string).includes('Attendance')) {
    visible.value = true;
  } else {
    next();
  }
});
</script>

<style scoped>
:deep(.pi.pi-plus.p-button-icon) {
  font-size: 0.75rem;
}
</style>
