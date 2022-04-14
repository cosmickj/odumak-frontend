<template>
  <div
    class="flex justify-content-evenly align-items-center h-5rem border-round shadow"
  >
    <router-link :to="{ name: 'AppHome' }">
      <div class="p-2">
        <i class="pi pi-home" style="font-size: 2rem"></i>
      </div>
    </router-link>

    <router-link :to="{ name: 'AttendanceInput' }">
      <div class="bg-yellow-500 p-2 border-circle">
        <i class="pi pi-plus" style="font-size: 2rem"></i>
      </div>
    </router-link>

    <router-link :to="{ name: 'AppUser' }">
      <div class="p-2">
        <i class="pi pi-user" style="font-size: 2rem"></i>
      </div>
    </router-link>
  </div>
</template>
