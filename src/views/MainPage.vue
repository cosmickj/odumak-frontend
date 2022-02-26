<template>
  <div id="main">
    <div class="menu__wrapper">
      <div class="menu__container">
        <h1 class="welcome">안녕하세요 이경준 선생님</h1>
        <div v-for="i in 3" :key="i" class="menu__item">menu {{ i }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "@vue/composition-api";

export default {
  setup() {
    onMounted(() => {});
  },
};
</script>

<style scoped>
.welcome {
  color: var(--color-text-white);
}
.menu__wrapper {
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  --align-items: center;
}
.menu__container {
  border-radius: 10px;
  padding: var(--container-padding);
}
.menu__item {
  background: orange;
  height: 100px;
}
</style>
