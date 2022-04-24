<template>
  <div
    class="p-5 h-full flex flex-column justify-content-center align-items-center"
  >
    <div class="pb-5 text-center">
      <h1>마이 페이지</h1>
      <div>아직 준비중입니다</div>
    </div>
    <Button class="p-button-danger" label="로그아웃" @click="logout" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const logout = async () => {
  await store.dispatch("account/logout");
  router.push({ name: "AccountLogin" });
};
</script>

<style scoped></style>
