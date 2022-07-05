<template>
  <div class="mx-7">
    <InlineSVG class="svg" :src="require('@/assets/youngeun_basic.svg')" />
  </div>
</template>

<script setup lang="ts">
import InlineSVG from "vue-inline-svg";
</script>

<style scoped>
.svg {
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
}
</style>
