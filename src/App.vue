<template>
  <router-view />
  <!-- <NavButton v-if="showsNavButton"></NavButton> -->
  <Navbar></Navbar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
// import NavButton from "@/components/NavButton.vue";

// export default defineComponent({
// components: { NavButton },
// setup() {
const router = useRouter();
// return {
//   showsNavButton: computed(() => {
//     if (
//       router.currentRoute.value.path === "/" ||
//       router.currentRoute.value.path === "/login" ||
//       router.currentRoute.value.path === "/signup" ||
//       router.currentRoute.value.path === "/main"
//     )
//       return false;
//     else return true;
//   }),
// };
// },
// });
</script>

<style>
#app {
  background-color: var(--surface-b);
}
</style>
