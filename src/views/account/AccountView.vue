<template>
  <div
    class="container flex-grow-1 flex flex-column justify-content-center w-screen h-screen surface-0 border-none border-200 border-round py-2"
  >
    <div class="mx-7">
      <AppYoungeunBasic></AppYoungeunBasic>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import AppYoungeunBasic from "@/components/AppYoungeunBasic.vue";
</script>

<style scoped>
@media (min-width: 450px) {
  .container {
    max-width: 350px !important;
    max-height: 600px !important;
    border: 1px solid !important;
  }
}
</style>
