<template>
  <div class="z-10 h-24 bg-white flex justify-evenly items-center">
    <TheNavbarItem icon="pi-home" title="메인 화면" route-name="HomeView" />

    <TheNavbarItem
      icon="pi-plus"
      title="출석 입력"
      route-name="AttendanceChecker"
      :is-important="true"
    />

    <TheNavbarItem icon="pi-user" title="내 정보" route-name="UserView" />
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
</script>
