<template>
  <main class="flex h-[100svh] items-center justify-center sm:bg-gray-200">
    <div
      class="relative h-full w-full overflow-hidden bg-slate-100 sm:max-h-[740px] sm:max-w-[360px] sm:rounded-2xl sm:shadow-lg"
    >
      <div class="flex h-full flex-col">
        <RouterView class="flex-1 overflow-auto" />
        <RouterView name="GlobalNavbar" />
      </div>

      <div
        v-if="mode !== 'production'"
        class="pointer-events-none fixed bottom-4 right-4 z-10 text-4xl opacity-30"
      >
        {{ mode }}
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
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const router = useRouter();
const { isAcceptDialogVisible } = storeToRefs(useUserStore());

const enterWaypoint = () => {
  isAcceptDialogVisible.value = false;
  router.push({ name: 'GroupCheck' });
};

const mode = import.meta.env.MODE;
</script>
