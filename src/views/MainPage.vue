<template>
  <div class="app-size main overflow-auto">
    <div class="welcome p-6 mb-3 bg-white h-10rem">
      <div
        class="h-full flex flex-column justify-content-center align-items-center"
      >
        <span class="text-2xl">안녕하세요,</span>
        <span class="text-4xl ml-2">이경준 선생님!</span>
      </div>
    </div>
    <div class="flex flex-column justify-content-center align-items-center">
      <div class="flex w-full">
        <router-link to="/daily-attendance" class="w-6 m-3">
          <Card>
            <template #title>
              <div>학생 <i class="pi pi-users"></i></div>
              <div class="pt-2">
                <span class="text-yellow-500">일일</span> 출석 현황
              </div>
            </template>
          </Card>
        </router-link>
        <Card class="w-6 m-3">
          <template #title>
            <div>학생 <i class="pi pi-users"></i></div>
            <div class="pt-2">
              <span class="text-yellow-500">누적</span> 출석 현황
            </div>
          </template>
        </Card>
      </div>

      <div class="flex w-full">
        <Card class="w-6 m-3">
          <template #title>
            <div>교사 <i class="pi pi-user-edit"></i></div>
            <div class="pt-2">
              <span class="text-yellow-500">일일</span> 출석 현황
            </div>
          </template>
        </Card>
        <Card class="w-6 m-3">
          <template #title>
            <div>교사 <i class="pi pi-user-edit"></i></div>
            <div class="pt-2">
              <span class="text-yellow-500">누적</span> 출석 현황
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
</script>

<style>
.p-card {
  aspect-ratio: 1/1;
}
.p-card-body {
  height: 100%;
}
.p-card-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: inherit;
  margin: 0 !important;
}
</style>

<style scoped>
.main {
  max-height: calc(100vh - var(--navbar-height));
  min-height: calc(100vh - var(--navbar-height));
}
.pi {
  font-size: 1.5rem;
}
</style>
