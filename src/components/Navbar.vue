<template>
  <div class="fixed right-0 bottom-0 left-0">
    <div
      class="navbar flex align-items-center justify-content-evenly bg-white h-5rem border-round"
    >
      <router-link to="/main">
        <div class="p-2">
          <i class="pi pi-home" style="font-size: 2rem"></i>
        </div>
      </router-link>

      <router-link to="/input">
        <div class="bg-yellow-500 p-2 border-circle">
          <i class="pi pi-plus" style="font-size: 2rem"></i>
        </div>
      </router-link>

      <router-link to="#">
        <div class="p-2">
          <i class="pi pi-user" style="font-size: 2rem"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.navbar {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
