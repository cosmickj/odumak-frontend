<template>
  <div>
    <router-view />
    <!-- <NavButton v-if="isContent"></NavButton> -->
    <NavButton />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavButton from "@/components/NavButton.vue";

export default defineComponent({
  components: {
    NavButton,
  },
  setup() {
    return {};
  },
});
</script>
