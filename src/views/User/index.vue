<template>
  <div class="p-5 h-full flex flex-col justify-center items-center">
    <div class="pb-5 text-center">
      <h1>마이 페이지</h1>
      <div>아직 준비중입니다</div>
    </div>
    <Button class="p-button-danger" label="로그아웃" @click="logout" />
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account';
import { useRouter } from 'vue-router';

const account = useAccountStore();
const router = useRouter();

const logout = async () => {
  await account.logoutAccount();
  router.push({ name: 'AccountLogin' });
};
</script>

<style scoped></style>
