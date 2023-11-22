<template>
  <div class="flex h-[100svh] flex-col sm:flex-row">
    <div class="hidden w-52 shrink-0 flex-col justify-center bg-black py-6 sm:flex sm:justify-between">
      <div class="flex flex-col gap-1 text-white">
        <Image :src="logoSidebar" />

        <RouterLink class="px-8 py-2" :to="{ name: 'AdminStudent' }">
          <i class="pi pi-home mr-1"></i>
          <span>학생 관리하기</span>
        </RouterLink>

        <RouterLink class="px-8 py-2" :to="{ name: 'AdminTeacher' }">
          <i class="pi pi-heart mr-1"></i>
          <span>교사 관리하기</span>
        </RouterLink>

        <RouterLink class="px-8 py-2" :to="{ name: 'AdminUser' }">
          <i class="pi pi-users mr-1"></i>
          <span>가입자 관리하기</span>
        </RouterLink>
      </div>

      <RouterLink class="px-8 py-2 text-center text-white" :to="{ name: 'HomeView' }">
        <i class="pi pi-home mr-1"></i>
        <span>홈으로 돌아가기</span>
      </RouterLink>
    </div>

    <div class="sm:hidden">
      <Toolbar class="relative rounded-none border-0 bg-black">
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
            class="absolute left-1/2 top-1/2 w-24 translate-x-[-50%] translate-y-[-50%]"
          />
        </template>
      </Toolbar>

      <OverlayPanel ref="op">
        <div class="flex flex-col gap-1">
          <RouterLink :to="{ name: 'AdminStudent' }" class="px-8 py-2" @click="toggle">
            <i class="pi pi-home mr-1"></i>
            <span>학생 관리하기</span>
          </RouterLink>

          <RouterLink :to="{ name: 'AdminTeacher' }" class="px-8 py-2" @click="toggle">
            <i class="pi pi-heart mr-1"></i>
            <span>교사 관리하기</span>
          </RouterLink>

          <RouterLink :to="{ name: 'AdminUser' }" class="px-8 py-2" @click="toggle">
            <i class="pi pi-users mr-1"></i>
            <span>가입자 관리하기</span>
          </RouterLink>

          <RouterLink class="px-8 py-2" :to="{ name: 'HomeView' }">
            <i class="pi pi-home mr-1"></i>
            <span>홈으로 돌아가기</span>
          </RouterLink>
        </div>
      </OverlayPanel>
    </div>

    <div class="flex-1 overflow-auto bg-zinc-700 px-8 py-4 text-white">
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
