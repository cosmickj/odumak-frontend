<template>
  <main class="h-[100svh] flex items-center justify-center sm:bg-gray-200">
    <div
      class="w-full sm:w-[360px] h-full sm:max-h-[640px] bg-slate-100 shadow-lg"
    >
      <div v-if="isAuthReady" class="flex flex-col h-full">
        <RouterView class="overflow-auto flex-1" />
        <RouterView name="GlobalNavbar" />
      </div>
    </div>
  </main>

  <Dialog
    modal
    v-model:visible="isVisible"
    class="w-1/2"
    position="bottom"
    header="승인이 필요합니다"
    :breakpoints="{ '640px': '90vw' }"
  >
    <div class="break-keep">
      <span class="font-semibold"> 추가정보(교회, 당담부서, 학급 등) </span>
      를 입력해주세요.
    </div>

    <template #footer>
      <Button
        class="text-xs"
        icon="pi pi-check"
        label="추가 정보 입력하기"
        severity="success"
        @click="enterWaypoint"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

const router = useRouter();
const { isAuthReady, isVisible } = storeToRefs(useUserStore());

const enterWaypoint = () => {
  isVisible.value = false;
  router.push({ name: 'GroupCheck' });
};
</script>
