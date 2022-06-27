<template>
  <div class="content h-full">
    <div class="p-5">
      <div class="text-2xl">안녕하세요,</div>
      <div class="text-4xl" v-if="authIsReady">{{ userName }} 선생님!</div>
    </div>

    <div class="p-5">
      <div class="flex pb-2">
        <!-- 학생 일일 출석 현황 -->
        <router-link :to="{ name: 'AttendanceStudentDaily' }" class="w-6">
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
        <router-link :to="{ name: 'AttendanceStudentTotal' }" class="w-6">
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
        <router-link :to="{ name: 'AttendanceTeacherDaily' }" class="w-6">
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
        <router-link :to="{ name: 'AttendanceTeacherTotal' }" class="w-6">
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
</template>

<script setup lang="ts">
import Card from "primevue/card";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const authIsReady = computed(() => store.state.account.authIsReady);
const userName = computed(() => store.state.account.user.name);
</script>

<style>
.content {
  background-color: #dfe0df;
}
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
