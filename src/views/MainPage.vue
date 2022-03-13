<template>
  <div id="main" v-if="userName">
    <div class="menu__wrapper">
      <div class="menu__container">
        <div class="welcome">안녕하세요 {{ userName }} 선생님</div>
        <router-link
          class="menu__item"
          v-for="(menu, i) in menus"
          :key="i"
          :to="menu.link"
        >
          <span class="menu__title">{{ menu.title }}</span>
          <i :class="menu.icon" class="menu__icon ml-10" />
        </router-link>
      </div>
    </div>
    <span class="btn-logout__container">
      <router-link to="/login" class="btn-logout" @click="logout">
        로그아웃
      </router-link>
    </span>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    // prettier-ignore
    const menus = [
      { title: "출석 입력하기", icon: "pi pi-pencil", link: "/input-attendance" },
      { title: "일일 출석 확인", icon: "pi pi-file", link: "/daily-attendance"  },
      { title: "누적 출석 확인", icon: "pi pi-book", link: "/total-attendance"  },
    ];
    const logout = () => {
      store.dispatch("logout");
    };
    return {
      menus,
      logout,
      user: computed(() => store.state.user),
      userName: computed(() => {
        if (store.state.userInfo) {
          return store.state.userInfo.name;
        }
      }),
      authIsReady: computed(() => store.state.authIsReady),
    };
  },
};
</script>

<style scoped>
@import url("@/css/views/MainPage.css");
</style>
