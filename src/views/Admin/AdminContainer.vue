<template>
  <div class="flex h-screen">
    <div class="shrink-0 w-52 py-6 bg-black text-white">
      <Image :src="logoSidebar" />
      <RouterLink class="block my-2 px-8 py-2" :to="{ name: 'AdminStudent' }">
        <i class="mr-1 pi pi-home"></i>
        학생 관리하기
      </RouterLink>

      <RouterLink class="block my-2 px-8 py-2" :to="{ name: 'AdminTeacher' }">
        <i class="mr-1 pi pi-heart"></i>
        교사 관리하기
      </RouterLink>

      <RouterLink class="block my-2 px-8 py-2" :to="{ name: 'AdminUser' }">
        <i class="mr-1 pi pi-users"></i>
        가입자 관리하기
      </RouterLink>
    </div>

    <div class="flex-1 overflow-auto px-8 py-6 bg-zinc-700 text-white">
      <RouterView />
    </div>
  </div>

  <AdminModal />
</template>

<script setup lang="ts">
import AdminModal from '@/views/Admin/AdminModal.vue';
import logoSidebar from '@/assets/images/logo-sidebar.png';
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  background: white;
  color: black;
}
</style>
