<template>
  <div>
    <div class="content flex-grow-1 w-screen overflow-auto bg-yellow-500">
      <div class="p-5">
        <div class="text-2xl">안녕하세요,</div>
        <div class="text-4xl">이경준 선생님!</div>
      </div>

      <div class="p-5">
        <div class="flex pb-2">
          <!-- 학생 일일 출석 현황 -->
          <router-link to="#" class="w-6">
            <Card class="mr-2">
              <template #title>
                <div><i class="pi pi-users" style="font-size: 2rem"></i></div>
                <div>학생</div>
                <div class="text-yellow-500">일일</div>
                <div>출석현황</div>
              </template>
            </Card>
          </router-link>

          <!-- 학생 누적 출석 현황 -->
          <router-link to="#" class="w-6">
            <Card class="ml-2">
              <template #title>
                <div><i class="pi pi-users" style="font-size: 2rem"></i></div>
                <div>학생</div>
                <div class="text-yellow-500">누적</div>
                <div>출석현황</div>
              </template>
            </Card>
          </router-link>
        </div>

        <div class="flex pt-2">
          <!-- 교사 일일 출석 현황 -->
          <router-link to="#" class="w-6">
            <Card class="mr-2">
              <template #title>
                <div>
                  <i class="pi pi-heart" style="font-size: 2rem"></i>
                </div>
                <div>교사</div>
                <div class="text-yellow-500">일일</div>
                <div>출석현황</div>
              </template>
            </Card>
          </router-link>

          <!-- 교사 누적 출석 현황 -->
          <router-link to="#" class="w-6">
            <Card class="ml-2">
              <template #title>
                <div>
                  <i class="pi pi-heart" style="font-size: 2rem"></i>
                </div>
                <div>교사</div>
                <div class="text-yellow-500">누적</div>
                <div>출석현황</div>
              </template>
            </Card>
          </router-link>
        </div>
      </div>
    </div>

    <AppNavbar></AppNavbar>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import AppNavbar from "@/components/AppNavbar.vue";
</script>

<style>
.p-card {
  aspect-ratio: 1/1;
}
.p-card-body {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.p-card-title {
  text-align: center;
}
</style>

<style scoped>
.content {
  height: calc(100vh - 50px);
}
@media (min-width: 450px) {
  .content {
    max-width: 350px !important;
    max-height: 600px !important;
  }
}
</style>
