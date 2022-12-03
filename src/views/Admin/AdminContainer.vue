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

    <Teleport to="#modal">
      <div
        v-if="isMobile"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-600/50"
      >
        <Card style="width: 90vw">
          <template #content>
            <div class="text-center text-xl font-bold">
              <p class="mb-2">오두막 관리자 페이지는</p>
              <p>PC 화면에서 최적의 경험을 제공합니다.</p>
            </div>
          </template>

          <template #footer>
            <div class="text-right">
              <Button
                class="p-button-secondary p-button-text"
                label="홈화면으로 돌아가기"
                @click="moveToHome"
              />
              <Button
                class="p-button-info"
                label="계속 이용하기"
                @click="keepGoing"
              />
            </div>
          </template>
        </Card>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isMobile = ref(false);

onMounted(() => {
  if (/Android|iPhone/i.test(navigator.userAgent)) {
    isMobile.value = true;
  }
});

const moveToHome = () => router.push({ name: 'HomeView' });

const keepGoing = () => (isMobile.value = false);
</script>

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
