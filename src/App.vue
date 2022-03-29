<template>
  <router-view />
  <NavButton v-if="showsNavButton"></NavButton>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import NavButton from "@/components/NavButton.vue";

export default defineComponent({
  components: { NavButton },
  setup() {
    const router = useRouter();
    return {
      showsNavButton: computed(() => {
        if (
          router.currentRoute.value.path === "/" ||
          router.currentRoute.value.path === "/login" ||
          router.currentRoute.value.path === "/signup" ||
          router.currentRoute.value.path === "/main"
        )
          return false;
        else return true;
      }),
    };
  },
});
</script>
