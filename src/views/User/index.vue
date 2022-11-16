<template>
  <div class="overflow-auto h-[calc(100%_-_6rem)]">
    <div class="h-full flex flex-col items-center justify-center">
      <div class="pb-5 text-center">
        <p>마이 페이지</p>
        <p>현재 준비중 입니다</p>
      </div>

      <Button class="p-button-danger" label="로그아웃" @click="logoutAccount" />

      <div class="pt-5">
        <p class="cursor-pointer" @click="deleteAccount">계정 탈퇴하기</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';

const router = useRouter();
const account = useAccountStore();

const logoutAccount = async () => {
  try {
    await account.logout();
    router.push({ name: 'AccountLogin' });
  } catch (error) {
    console.log(error);
  }
};

const deleteAccount = async () => {
  try {
    if (confirm('정말로 탈퇴하시겠습니까?')) {
      await account.delete();
      router.push({ name: 'AccountLogin' });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
