<template>
  <div>
    <router-view></router-view>
    <NavButton v-if="isContent"></NavButton>
  </div>
</template>

<script>
import NavButton from "@/components/NavButton.vue";
export default {
  components: { NavButton },
  computed: {
    isContent() {
      if (this.$route.name === "LoginPage" || this.$route.name === "MainPage") {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    console.log(this.$route.name);
  },
};
</script>

<style></style>
