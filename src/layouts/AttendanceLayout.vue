<template>
  <router-view></router-view>
  <TheNavbar v-if="hasNavbar"></TheNavbar>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/TheNavbar.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const hasNavbar = ref(true);
onMounted(() => {
  if (route.name === 'AttendanceChecker') {
    hasNavbar.value = false;
  }
});
</script>
