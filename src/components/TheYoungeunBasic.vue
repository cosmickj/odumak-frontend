<template>
  <div class="mx-7">
    <InlineSvg class="youngeun-basic" :src="youngeunBasic"></InlineSvg>
  </div>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg';
import youngeunBasic from '@/assets/svg/youngeun-basic.svg';
</script>

<style scoped>
.youngeun-basic {
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
}
</style>
