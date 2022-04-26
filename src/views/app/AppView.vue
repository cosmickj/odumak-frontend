<template>
  <div class="container flex-grow-1 w-screen h-full overflow-auto border-round-top">
    <router-view></router-view>
  </div>
  <AppNavbar></AppNavbar>
</template>

<script setup lang="ts">
import AppNavbar from "@/components/AppNavbar.vue";
</script>

<style scoped>
@media (min-width: 450px) {
  .container {
    max-width: 350px !important;
    max-height: 600px !important;
  }
}
</style>
