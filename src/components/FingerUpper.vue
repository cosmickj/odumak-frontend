<template>
  <div class="indicator__container mt-24">
    <div class="indicator__items">
      <InlineSVG :src="require('@/assets/finger_up.svg')"></InlineSVG>
      <div>날짜를 선택해주세요</div>
    </div>
  </div>
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
.indicator__container {
  display: flex;
  justify-content: center;
}
.indicator__items {
  width: 30%;
  text-align: center;
  color: var(--color-black);
}
</style>
