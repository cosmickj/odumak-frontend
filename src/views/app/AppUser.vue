<template>
  <div>
    <h1>User Personal Page</h1>
    <button @click="logout">로그아웃</button>
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
