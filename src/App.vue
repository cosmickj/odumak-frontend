<template>
  <router-view />
  <!-- <Navbar v-if="isNavbar"></Navbar> -->
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();

const isNavbar = computed(() => {
  if (
    router.currentRoute.value.path === "/" ||
    router.currentRoute.value.path === "/login" ||
    router.currentRoute.value.path === "/signup"
  ) {
    return false;
  } else {
    return true;
  }
});
</script>
