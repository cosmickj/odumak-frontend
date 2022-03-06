<template>
  <div class="btn-nav">
    <span
      class="btn-nav__icon"
      :class="{ active: isActive }"
      @click="activeBtnNav"
    >
      <i class="pi pi-home" v-if="!isActive"></i>
      <i class="pi pi-bars" v-else></i>
    </span>
    <ul class="btn-nav__menus">
      <li @click="activeBtnNav">
        <router-link to="/main">
          <i class="pr-10 pi pi-home"></i>
          홈화면
        </router-link>
      </li>
      <li @click="activeBtnNav">
        <router-link to="/input-attendance">
          <i class="pr-10 pi pi-pencil"></i>
          출석 입력하기
        </router-link>
      </li>
      <li @click="activeBtnNav">
        <router-link to="/daily-attendance">
          <i class="pr-10 pi pi-file"></i>
          일일 출석 확인
        </router-link>
      </li>
      <li @click="activeBtnNav">
        <router-link to="/total-attendance">
          <i class="pr-10 pi pi-book"></i>
          누적 출석 확인
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const isActive = ref(false);

    const activeBtnNav = () => {
      isActive.value = !isActive.value;
    };

    return {
      isActive,
      activeBtnNav,
    };
  },
});
</script>

<style scoped>
.btn-nav {
  z-index: 999;
  position: fixed;
  bottom: 40px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #eee;
  border-radius: 50%;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
}
.btn-nav__icon {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  transition: 0.2s ease-in-out;
  user-select: none;
  cursor: pointer;
}
.btn-nav__icon.active {
  transform: rotateY(180deg);
}
.btn-nav__menus {
  position: absolute;
  bottom: 55px;
  right: 0;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 0 14px;
  border-radius: 20px;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  list-style: none;
}
.btn-nav__icon.active + .btn-nav__menus {
  bottom: 60px;
  opacity: 1;
  visibility: visible;
  transition: 0.3s;
}
.btn-nav__menus li a {
  padding: 8px 0;
  display: flex;
  align-items: center;
  color: var(--color-text);
}
.btn-nav__menus li:not(:last-child) {
  border-bottom: 1px solid #333;
}
</style>
