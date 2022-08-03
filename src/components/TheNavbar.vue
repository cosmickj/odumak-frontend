<template>
  <div class="z-10 flex justify-evenly items-center h-24 bg-white">
    <TheNavbarItem :icon="'pi-home'" :title="'메인 화면'" :route-name="'HomeView'" />
    <!-- TODO: 유저의 권한에 따라서 들어가는 출석입력창이 달라지게 해야한다. -->
    <TheNavbarItem
      :icon="'pi-plus'"
      :title="'출석 입력'"
      :route-name="'AttendanceChecker'"
      :position="'students'"
      :is-important="true"
    />
    <TheNavbarItem :icon="'pi-user'" :title="'내 정보'" :route-name="'UserView'" />
  </div>
</template>

<script setup lang="ts">
import TheNavbarItem from '@/components/TheNavbarItem.vue';
</script>
