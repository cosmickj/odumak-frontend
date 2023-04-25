<template>
  <div class="flex sm:flex-row flex-col h-[100svh]">
    <div
      class="shrink-0 sm:flex hidden flex-col sm:justify-between justify-center w-52 py-6 bg-black"
    >
      <div class="flex flex-col gap-1 text-white">
        <Image :src="logoSidebar" />

        <RouterLink class="px-8 py-2" :to="{ name: 'AdminStudent' }">
          <i class="mr-1 pi pi-home"></i>
          <span>학생 관리하기</span>
        </RouterLink>

        <RouterLink class="px-8 py-2" :to="{ name: 'AdminTeacher' }">
          <i class="mr-1 pi pi-heart"></i>
          <span>교사 관리하기</span>
        </RouterLink>

        <RouterLink class="px-8 py-2" :to="{ name: 'AdminUser' }">
          <i class="mr-1 pi pi-users"></i>
          <span>가입자 관리하기</span>
        </RouterLink>
      </div>

      <RouterLink
        class="px-8 py-2 text-white text-center"
        :to="{ name: 'HomeView' }"
      >
        <i class="mr-1 pi pi-home"></i>
        <span>홈으로 돌아가기</span>
      </RouterLink>
    </div>

    <div class="sm:hidden">
      <Toolbar class="relative bg-black rounded-none border-0">
        <template #start>
          <Button
            outlined
            class="aspect-square"
            severity="warning"
            icon="pi pi-align-justify"
            @click="toggle"
          />
        </template>

        <template #center>
          <Image
            :src="logoSidebar"
            class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-24"
          />
        </template>
      </Toolbar>

      <OverlayPanel ref="op">
        <div class="flex flex-col gap-1">
          <RouterLink
            :to="{ name: 'AdminStudent' }"
            class="px-8 py-2"
            @click="toggle"
          >
            <i class="mr-1 pi pi-home"></i>
            <span>학생 관리하기</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'AdminTeacher' }"
            class="px-8 py-2"
            @click="toggle"
          >
            <i class="mr-1 pi pi-heart"></i>
            <span>교사 관리하기</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'AdminUser' }"
            class="px-8 py-2"
            @click="toggle"
          >
            <i class="mr-1 pi pi-users"></i>
            <span>가입자 관리하기</span>
          </RouterLink>

          <RouterLink class="px-8 py-2" :to="{ name: 'HomeView' }">
            <i class="mr-1 pi pi-home"></i>
            <span>홈으로 돌아가기</span>
          </RouterLink>
        </div>
      </OverlayPanel>
    </div>

    <div class="flex-1 overflow-auto px-8 py-4 bg-zinc-700 text-white">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import logoSidebar from '@/assets/images/logo-sidebar.png';

const op = ref();
const toggle = (event: Event) => op.value.toggle(event);
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  background: white;
  font-weight: bold;
  color: black;
}
</style>
