<template>
  <div class="relative flex py-2 bg-white rounded-lg items-end justify-around">
    <TheNavbarItem icon="pi pi-home" label="홈화면" route-name="HomeView" />
    <TheNavbarItem
      icon="pi pi-plus"
      label="출석입력"
      route-name="AttendanceChecker"
      :class-name="coreBtnState"
    />
    <TheNavbarItem icon="pi pi-user" label="내정보" route-name="UserView" />
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const coreBtnState = computed(() => {
  return route.name === 'HomeView' ? 'core' : 'core core--hidden';
});
</script>

<style scoped>
:deep(.core) {
  position: absolute;
  top: -3rem;
  left: 50%;
  display: flex;
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  border: 8px solid rgb(241, 245, 249);
  background: rgb(37 99 235);
  color: rgb(255 255 255);
  align-items: center;
  justify-content: center;
  transform: translate(-50%, 0);
  transition: all 0.5s ease;
  animation: grow 0.8s;
}
:deep(.core::before) {
  content: '';
  position: absolute;
  top: 38px;
  left: -22px;
  width: 20px;
  height: 20px;
  border-top-right-radius: 20px;
  background: transparent;
  box-shadow: 0 -10px 0 0 rgba(241 245 249);
  transition: all 0.5s ease;
  transition-delay: 0.3s;
}
:deep(.core::after) {
  content: '';
  position: absolute;
  top: 38px;
  right: -22px;
  width: 20px;
  height: 20px;
  border-top-left-radius: 20px;
  background: transparent;
  box-shadow: 0 -10px 0 0 rgb(241 245 249);
  transition: all 0.5s ease;
  transition-delay: 0.3s;
}

:deep(.core--hidden) {
  top: 0.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border: 2px solid rgb(96, 165, 250);
}
:deep(.core--hidden + *) {
  display: none;
}
:deep(.core--hidden::before),
:deep(.core--hidden::after) {
  box-shadow: unset;
  transition: none;
}

@keyframes grow {
  0% {
    transform: translate(-50%, 0) scale(0);
  }
  50% {
    transform: translate(-50%, 0) scale(1.3);
  }
  100% {
    transform: translate(-50%, 0) scale(1);
  }
}
</style>
