<template>
  <RouterLink
    :class="[
      { 'button-important': important },
      { 'button-important--hide': !isHome },
    ]"
    :to="{ name: routeName }"
  >
    <div class="relative flex w-14 h-14 items-center justify-center">
      <i class="text-2xl" :class="icon"></i>
      <slot></slot>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineProps<{
  icon: string;
  routeName: string;
  important?: boolean;
}>();

const route = useRoute();

const isHome = computed(() => {
  if (route.name === 'HomeView') {
    return true;
  }
  return false;
});
</script>

<style scoped>
.button-important {
  position: relative;
  bottom: 26px;
  background: rgb(234, 179, 8);
  border: 4px solid rgb(241, 245, 249);
  border-radius: 50%;
  transition: all 0.5s;
}
.button-important--hide {
  bottom: 0px;
  border-color: rgb(255, 255, 255);
}
</style>
