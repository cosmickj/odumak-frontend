<template>
  <!-- <div id="main" v-if="name"> -->
  <div id="main">
    <div class="menu__wrapper">
      <div class="menu__container">
        <div class="welcome">안녕하세요 {{ name }} 선생님</div>
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

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    // prettier-ignore
    const menus = [
      { title: "출석 입력하기", icon: "pi pi-pencil", link: "/input" },
      { title: "일일 출석 확인", icon: "pi pi-file", link: "/daily-attendance"  },
      { title: "누적 출석 확인", icon: "pi pi-book", link: "/total-attendance"  },
    ];
    const logout = () => {
      store.dispatch("user/logout");
    };
    return {
      menus,
      logout,
      name: computed(() => {
        if (store.state.user.info) {
          return store.state.user.info.name;
        } else {
          return false;
        }
      }),
      authIsReady: computed(() => store.state.user.authIsReady),
    };
  },
});
</script>

<style scoped>
@import url("@/css/views/MainPage.css");
</style>
