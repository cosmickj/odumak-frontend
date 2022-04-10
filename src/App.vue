<template>
  <section class="min-h-screen flex">
    <main class="flex-grow-1 flex justify-content-center align-items-center">
      <router-view />
    </main>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
@media (min-width: 451px) {
  main {
    background-color: var(--surface-100) !important;
  }
}
</style>
