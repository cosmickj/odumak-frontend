<template>
  <section class="min-h-screen flex">
    <main
      class="flex-grow-1 flex justify-content-center align-items-center surface-0"
    >
      <div
        class="container flex-grow-1 max-w-screen surface-0 border-none border-400 border-round py-2"
      >
        <div class="mx-7">
          <YoungeunBasic></YoungeunBasic>
        </div>
        <router-view></router-view>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import YoungeunBasic from "@/components/YoungeunBasic.vue";
</script>

<style scoped>
/* 451px보다 화면이 커졌을 때의 설정 */
@media (min-width: 451px) {
  main {
    background-color: #fafafa !important;
  }
  .container {
    max-width: 350px !important;
    border: 1px solid !important;
  }
}
</style>
