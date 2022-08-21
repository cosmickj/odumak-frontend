<template>
  <RouterLink
    :class="[
      { 'button-important': isImportant },
      { 'button-important--hide': !isHome },
    ]"
    :to="{ name: routeName }"
  >
    <div class="flex w-20 h-20 items-center justify-center">
      <i class="text-5xl" :class="icon"></i>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineProps<{
  icon: string;
  routeName: string;
  isImportant?: boolean;
}>();

const route = useRoute();
const isHome = computed(() => {
  if (route.name === 'HomeView') {
    return true;
  } else {
    return false;
  }
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
