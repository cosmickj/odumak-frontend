<template>
  <div class="flex h-[100svh] flex-col sm:flex-row">
    <div class="hidden bg-black sm:!block">
      <RouterLink class="my-4 inline-block w-52 border-b border-blue-100" :to="{ name: 'HomeView' }">
        <Image :src="logoSidebar" />
      </RouterLink>

      <div class="flex flex-col gap-2 pl-4 text-white">
        <div class="flex flex-col gap-2">
          <RouterLink class="px-4 py-2 hover:rounded-s-3xl hover:bg-blue-100/60" :to="{ name: 'AdminStudent' }">
            <i class="pi pi-home mr-4"></i>
            <span>학생 관리하기</span>
          </RouterLink>

          <RouterLink class="px-4 py-2 hover:rounded-s-3xl hover:bg-blue-100/60" :to="{ name: 'AdminTeacher' }">
            <i class="pi pi-heart mr-4"></i>
            <span>교사 관리하기</span>
          </RouterLink>

          <RouterLink class="px-4 py-2 hover:rounded-s-3xl hover:bg-blue-100/60" :to="{ name: 'AdminUser' }">
            <i class="pi pi-users mr-4"></i>
            <span>가입자 관리하기</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="sm:hidden">
      <Toolbar class="relative rounded-none border-0 bg-black">
        <template #start>
          <Button
            outlined
            class="aspect-square"
            icon="pi pi-align-justify"
            severity="warning"
            @click="toggle"
          />
        </template>

        <template #center>
          <Image
            class="absolute left-1/2 top-1/2 w-24 translate-x-[-50%] translate-y-[-50%]"
            :src="logoSidebar"
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

    <div class="h-full w-full bg-blue-100 px-8 py-4">
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
  @apply rounded-3xl bg-blue-100 text-black sm:rounded-none sm:rounded-s-3xl;
}
</style>
