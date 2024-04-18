<template>
  <section>
    <AppHeader header="달란트 관리하기" route-name="HomeView" />

    <div class="flex text-center">
      <RouterLink
        class="relative flex-1 py-3 before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:content-normal before:bg-gray-500/10"
        :to="{ name: 'TalentInput' }"
      >
        달란트 입력하기
      </RouterLink>
      <RouterLink
        class="relative flex-1 py-3 before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:content-normal before:bg-gray-500/10"
        :to="{ name: 'TalentStatus' }"
      >
        달란트 확인하기
      </RouterLink>
    </div>

    <RouterView />
  </section>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  @apply before:bg-blue-500;
}
</style>
