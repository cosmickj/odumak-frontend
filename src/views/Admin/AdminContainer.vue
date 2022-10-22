<template>
  <div class="wrapper">
    <div class="container">
      <div class="p-5 text-center select-none my-12">
        <RouterLink class="text-2xl" :to="{ name: 'HomeView' }">
          <i class="text-2xl mr-2 pi pi-home"></i>
          홈
        </RouterLink>

        <span class="text-2xl mx-5">|</span>

        <RouterLink class="text-2xl" :to="{ name: 'AdminStudent' }">
          <i class="text-2xl mr-2 pi pi-user"></i>
          학생 목록
        </RouterLink>

        <span class="text-2xl mx-5">|</span>

        <RouterLink class="text-2xl" :to="{ name: 'AdminTeacher' }">
          <i class="text-2xl mr-2 pi pi-pencil"></i>
          교사 목록
        </RouterLink>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}
.router-link-exact-active {
  font-weight: bold;
  color: orange;
}
</style>
