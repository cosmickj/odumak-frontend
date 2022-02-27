<template>
  <div class="btn-nav">
    <span
      class="btn-nav__icon"
      :class="{ active: isActive }"
      @click="activeBtnNav"
    >
      <font-awesome-icon icon="fa-solid fa-house" v-if="!isActive" />
      <font-awesome-icon icon="fa-solid fa-bars-staggered" v-else />
    </span>
    <ul class="btn-nav__menus">
      <li @click="activeBtnNav">
        <router-link to="/main">
          <font-awesome-icon class="pr-3" icon="fa-solid fa-house" size="1x" />
          홈화면
        </router-link>
      </li>
      <li @click="activeBtnNav">
        <router-link to="/input-attendance">
          <font-awesome-icon
            class="pr-3"
            icon="fa-solid fa-pen-to-square"
            size="1x"
          />
          출석 입력하기
        </router-link>
      </li>
      <li @click="activeBtnNav">
        <router-link to="/daily-attendance">
          <font-awesome-icon
            class="pr-3"
            icon="fa-solid fa-file-lines"
            size="1x"
          />
          일일 출석 확인
        </router-link>
      </li>
      <li @click="activeBtnNav">
        <router-link to="/total-attendance">
          <font-awesome-icon class="pr-3" icon="fa-solid fa-book" size="1x" />
          누적 출석 확인
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    activeBtnNav() {
      this.isActive = !this.isActive;
    },
  },
});
</script>

<style scoped>
.btn-nav {
  position: fixed;
  bottom: 50px;
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
  font-size: 3rem;
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
  font-size: 1.6rem;
  padding: 8px 0;
  display: flex;
  align-items: center;
  color: var(--color-text);
}
.btn-nav__menus li:not(:last-child) {
  border-bottom: 1px solid #333;
}
</style>
