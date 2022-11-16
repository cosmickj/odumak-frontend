<template>
  <div class="overflow-auto h-[calc(100%_-_6rem)]">
    <div class="p-5 h-full flex flex-col justify-center items-center">
      <div class="pb-5 text-center">
        <p>마이 페이지</p>
        <p>현재 준비중 입니다</p>
      </div>
      <Button class="p-button-danger" label="로그아웃" @click="logout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account';
import { useRouter } from 'vue-router';

const account = useAccountStore();
const router = useRouter();

const logout = async () => {
  await account.logout();
  router.push({ name: 'AccountLogin' });
};
</script>
