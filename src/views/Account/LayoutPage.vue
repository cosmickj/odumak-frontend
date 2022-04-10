<template>
  <div
    class="container flex-grow-1 flex flex-column justify-content-center w-screen h-screen surface-0 border-none border-200 border-round py-2"
  >
    <div class="mx-7">
      <YoungeunBasic></YoungeunBasic>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import YoungeunBasic from "@/components/YoungeunBasic.vue";
</script>

<style scoped>
@media (min-width: 451px) {
  .container {
    max-width: 350px !important;
    max-height: 630px !important;
    border: 1px solid !important;
  }
}
</style>
