<template>
  <section class="flex flex-col items-center justify-center p-5">
    <div>
      <p>🎉 환영합니다!</p>
      <p>회원가입 요청이 정상적으로 접수되었습니다.</p>
      <p>관리자가 요청을 승인하면 알려드릴게요!</p>
      <p>기다려 주셔서 감사합니다. 😊</p>
    </div>

    <div class="ml-auto mt-4">
      <Button
        text
        label="로그아웃"
        size="small"
        severity="danger"
        icon="pi pi-sign-out"
        iconPos="right"
        @click="logoutUser"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();

const logoutUser = async () => {
  try {
    if (confirm('로그아웃 하시겠습니까?')) {
      await userStore.logout();
      router.push({ name: 'LoginView' });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style>
