<template>
  <div class="flex bg-white rounded-t-3xl items-center justify-evenly">
    <TheNavbarItem icon="pi pi-home" route-name="HomeView" />

    <TheNavbarItem
      icon="pi pi-plus"
      route-name="AttendanceChecker"
      :is-important="true"
    />

    <TheNavbarItem icon="pi pi-user" route-name="UserView" />
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
</script>
