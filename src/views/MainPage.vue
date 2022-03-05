<template>
  <div id="main">
    <div class="menu__wrapper">
      <div class="menu__container">
        <div class="welcome">안녕하세요 이경준 선생님</div>

        <router-link
          class="menu__item"
          v-for="(menu, i) in menuList"
          :key="i"
          :to="menu.link"
        >
          <span class="menu__title">{{ menu.title }}</span>
          <font-awesome-icon :icon="menu.icon" class="menu__icon" />
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

    const menuList = [
      {
        title: "출석 입력하기",
        icon: "pen-to-square",
        link: "/input-attendance",
      },
      {
        title: "일일 출석 확인",
        icon: "file-lines",
        link: "/daily-attendance",
      },
      {
        title: "누적 출석 확인",
        icon: "book",
        link: "/total-attendance",
      },
    ];

    const logout = () => {
      store.dispatch("logout");
    };
    return {
      menuList,
      logout,
      user: computed(() => store.state.user),
      authIsReady: computed(() => store.state.authIsReady),
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap");

.bible {
  margin-bottom: 30px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
.bible__content {
  font-family: "Noto Serif KR", serif;
  font-size: 1.2rem;
  color: var(--color-text-white);
}
.bible__book {
  font-family: "Noto Serif KR", serif;
  color: var(--color-text-white);
}
.bible__book__version {
  font-family: "Noto Serif KR", serif;
  font-size: 0.8rem;
  color: #ccc;
}
.welcome {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  color: var(--color-text-white);
  margin-bottom: 30px;
  font-size: 1.4rem;
}
.btn-logout__container {
  position: absolute;
  top: 20px;
  right: 20px;
}
.btn-logout {
  color: #ccc;
  --border-bottom: 1px solid #ccc;
}
.menu__wrapper {
  position: relative;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.menu__container {
  border-radius: 10px;
  padding: var(--container-padding);
}
.menu__item {
  display: block;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
  text-align: center;
  padding: 30px 0;
  background: var(--yellow-500);
}
.menu__title,
.menu__icon {
  font-size: 1.6rem;
  color: #333;
}
.menu__icon {
  margin-left: 10px;
}
</style>
