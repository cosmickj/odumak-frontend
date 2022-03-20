<template>
  <div class="card">
    <div class="flex card-container indigo-container">
      <div
        class="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round"
      >
        1
      </div>
      <div
        class="flex-1 h-4rem bg-indigo-500 text-white font-bold text-center p-4 border-round"
      >
        2
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped>
.y-container {
  background: orange;
  height: 300px;
  text-align: center;
}
</style>
