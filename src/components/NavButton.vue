<template>
  <div class="btn-nav">
    <span
      class="btn-nav__icon"
      :class="{ active: isActive }"
      @click="setNavButton"
    >
      <i class="pi pi-home fz-14" v-if="!isActive"></i>
      <i class="pi pi-bars fz-14" v-else></i>
    </span>
    <ul class="btn-nav__menus">
      <li v-for="(navMenu, i) in navMenus" :key="i" @click="setNavButton">
        <router-link :to="navMenu.link">
          <i class="pr-10" :class="navMenu.icon"></i>
          {{ navMenu.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    // prettier-ignore
    const navMenus = [
      { title: "홈화면", icon: "pi pi-home", link: "/main" },
      { title: "출석 입력하기", icon: "pi pi-pencil", link: "/input" },
      { title: "일일 출석 확인", icon: "pi pi-file", link: "/daily-attendance"  },
      { title: "누적 출석 확인", icon: "pi pi-book", link: "/total-attendance"  },
    ];
    const isActive = ref(false);
    const setNavButton = () => {
      isActive.value = !isActive.value;
    };
    return {
      navMenus,
      isActive,
      setNavButton,
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
  border-radius: 50%;
  background: var(--color-yellow);
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
}
.btn-nav__icon {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-black);
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
  min-width: 150px;
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
  color: var(--color-black);
}
.btn-nav__menus li:not(:last-child) {
  border-bottom: 1px solid var(--color-black);
}
</style>
