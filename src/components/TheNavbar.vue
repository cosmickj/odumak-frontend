<template>
  <div class="relative flex items-end justify-around rounded-lg bg-white py-2">
    <TheNavbarItem icon="pi pi-home" label="홈화면" route-name="HomeView" />

    <TheNavbarItem icon="pi pi-map" label="학생 출석" route-name="AttendanceTrackerDailyStudent" />

    <TheNavbarItem icon="pi pi-compass" label="교사 출석" route-name="AttendanceTrackerDailyTeacher" />

    <TheNavbarItem icon="pi pi-user" label="내정보" route-name="UserView" />

    <RouterLink class="core" :to="{ name: 'AttendanceChecker' }">
      <div>출석 체크하기</div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
</script>

<style scoped>
:deep(.core) {
  @apply py-2 text-xl;
  position: absolute;
  top: calc((44px + 4px) * -1);
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 16px);
  border-radius: 8px;
  background: rgb(37 99 235);
  color: rgb(255 255 255);
  transition: all 0.5s ease;
  animation: soaring 0.8s ease-in-out;
}

@keyframes soaring {
  0% {
    transform: translate(0, 100%);
  }
  50% {
    transform: translate(0, -20%);
  }
}
</style>
