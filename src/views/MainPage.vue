<template>
  <div id="main">
    <div class="menu__wrapper">
      <div class="menu__container">
        <h2 class="welcome">안녕하세요 이경준 선생님</h2>

        <router-link
          class="menu__item"
          v-for="(menu, i) in menuList"
          :key="i"
          :to="menu.link"
        >
          <span class="menu__title">{{ menu.title }}</span>
          <font-awesome-icon :icon="menu.icon" class="menu__icon" />
        </router-link>

        <div class="bible">
          <div class="bible__content">
            볼찌어다 내가 문밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을
            열면 내가 그에게로 들어가 그로 더불어 먹고 그는 나로 더불어 먹으리라
          </div>
          <div class="bible__book">
            요한계시록 3:20 <span class="bible__book__version">개역한글</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const menuList = [
      {
        title: "출석 입력하기",
        icon: "fa-solid fa-pen-to-square",
        link: "/input-attendance",
      },
      {
        title: "일일 출석 확인",
        icon: "fa-solid fa-file-lines",
        link: "/daily-attendance",
      },
      {
        title: "누적 출석 확인",
        icon: "fa-solid fa-book",
        link: "/total-attendance",
      },
    ];
    return {
      menuList,
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
}
.menu__wrapper {
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
  background: #f9f871;
  text-align: center;
  padding: 30px 0;
}
.menu__title,
.menu__icon {
  font-size: 2.2rem;
  color: #333;
}
.menu__icon {
  margin-left: 10px;
}
</style>
