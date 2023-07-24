<template>
  <main class="h-[100svh] flex items-center justify-center sm:bg-gray-200">
    <div
      class="overflow-hidden relative w-full sm:w-[360px] h-full sm:max-h-[640px] bg-slate-100 shadow-lg"
    >
      <div class="flex flex-col h-full">
        <RouterView class="overflow-auto flex-1" />
        <RouterView name="GlobalNavbar" />
      </div>

      <div
        v-if="mode === 'development'"
        class="z-10 opacity-30 absolute inset-0 flex justify-center items-center pointer-events-none"
      >
        <p class="px-4 py-2 rounded text-4xl -rotate-[24deg]">
          &copy; app.odumak.xyz
        </p>
      </div>
    </div>
  </main>

  <Dialog
    modal
    v-model:visible="isAcceptDialogVisible"
    class="w-1/2"
    position="bottom"
    header="승인이 필요합니다"
    :breakpoints="{ '640px': '90vw' }"
  >
    <div class="break-keep">
      <span class="font-semibold">추가정보(교회, 담당부서, 학급 등)</span>
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
const { isAcceptDialogVisible } = storeToRefs(useUserStore());

const enterWaypoint = () => {
  isAcceptDialogVisible.value = false;
  router.push({ name: 'GroupCheck' });
};

const mode = import.meta.env.MODE;
</script>
