<template>
  <header
    class="relative text-center py-4 shadow-[0_1px_9px_-2px_rgba(0,0,0,0.5)]"
  >
    <RouterLink
      class="absolute top-1/2 left-2 -translate-y-1/2"
      :to="{ name: 'HomeView' }"
    >
      <Button rounded icon="pi pi-angle-left" severity="secondary" />
    </RouterLink>

    <span class="text-xl">출석 체크</span>
  </header>
</template>

<script setup lang="ts"></script>
