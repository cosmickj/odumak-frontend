<template>
  <div class="flex bg-white rounded-t-xl items-center justify-evenly">
    <TheNavbarItem icon="pi pi-home" route-name="HomeView" />
    <TheNavbarItem important icon="pi pi-plus" route-name="AttendanceChecker" />
    <TheNavbarItem icon="pi pi-user" route-name="UserView" />
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
</script>
