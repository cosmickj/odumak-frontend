<template>
  <main class="main">
    <router-view></router-view>
  </main>
  <AppNavbar></AppNavbar>
</template>

<script setup lang="ts">
import AppNavbar from "@/components/AppNavbar.vue";
</script>

<style scoped>
.main {
  /* display: flex; */
  height: calc(100vh - 50px);
}
</style>
