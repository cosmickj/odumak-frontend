<template>
  <section class="min-h-screen flex">
    <main
      class="flex-grow-1 flex justify-content-center align-items-center surface-50"
    >
      <div
        class="container flex-grow-1 max-w-full surface-0 sm:border-none md:border-1 border-400 border-round py-2"
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
@media (min-width: 375px) {
  main {
    background-color: #ffffff !important;
  }
  .container {
    max-width: 350px !important;
  }
}
</style>
