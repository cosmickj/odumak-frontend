<template>
  <div class="flex py-1 bg-white items-center justify-around">
    <TheNavbarItem icon="pi pi-home" label="홈화면" route-name="HomeView" />
    <TheNavbarItem
      icon="pi pi-plus-circle"
      label="출석입력"
      route-name="AttendanceChecker"
    />
    <TheNavbarItem icon="pi pi-user" label="내정보" route-name="UserView" />
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
</script>
