<template>
  <InlineSVG
    class="svg"
    :src="require('@/assets/youngeun_basic.svg')"
  ></InlineSVG>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InlineSVG from "vue-inline-svg";
import "animate.css";

export default defineComponent({
  components: { InlineSVG },
});
</script>

<style scoped>
.svg {
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
}
</style>
