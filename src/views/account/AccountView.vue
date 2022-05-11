<template>
  <div class="account-view" :class="isPopup ? 'account-view--hide' : ''">
    <AppYoungeunBasic></AppYoungeunBasic>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </router-view>
  </div>

  <div class="popup" :class="isPopup ? 'popup--show' : ''">
    <div class="text-2xl">
      <p>안녕하세요 선생님!</p>
      <p>원할한 출석 관리를 위해</p>
      <p><span>회원가입</span>을 진행해주세요.</p>
    </div>

    <router-link :to="{ name: 'AccountSignup' }" @click="togglePopup">
      <Button label="좋아요 :)" type="button" class="p-button-warning"></Button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppYoungeunBasic from "@/components/AppYoungeunBasic.vue";

const isPopup = ref(false);

onMounted(() => {
  setTimeout(() => {
    isPopup.value = !isPopup.value;
  }, 1000);
});

const togglePopup = () => {
  isPopup.value = false;
};
</script>

<style scoped>
.popup {
  position: absolute;
  top: calc(60% - 80px);
  left: 5%;
  height: 160px;
  width: 90%;
  background-color: #fff;
  border: 3px solid var(--yellow-500);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
}
.popup--show {
  top: calc(50% - 80px);
  visibility: visible;
  opacity: 1;
  transition: 0.5s;
}
.account-view--hide {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
