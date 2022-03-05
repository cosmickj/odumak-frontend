<template>
  <div class="container">
    <!-- <Navbar /> -->
    <router-view />
    <!-- <NavButton v-if="isContent"></NavButton> -->
    <NavButton />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import Navbar from "@/components/Navbar.vue";
import NavButton from "@/components/NavButton.vue";

export default defineComponent({
  components: {
    // Navbar,
    NavButton,
  },
  setup() {
    return {};
  },
});
</script>
