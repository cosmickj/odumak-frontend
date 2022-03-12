<template>
  <div>
    <router-view />
    <NavButton v-if="isContent"></NavButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import NavButton from "@/components/NavButton.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: { NavButton },
  created() {
    const store = useStore();
    store.dispatch("fetchUserInfo");
  },
  setup() {
    const router = useRouter();
    return {
      isContent: computed(() => {
        if (
          router.currentRoute.value.path === "/" ||
          router.currentRoute.value.path === "/login" ||
          router.currentRoute.value.path === "/signup"
        )
          return false;
        else return true;
      }),
    };
  },
});
</script>
