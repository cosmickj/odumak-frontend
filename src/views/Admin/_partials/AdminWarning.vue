<template>
  <Teleport to="#modal">
    <div
      v-if="isMobile"
      class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-600/50"
    >
      <Card style="width: 90vw">
        <template #content>
          <div class="text-center text-xl font-bold">
            <p class="mb-2">관리자 페이지는</p>
            <p>PC 화면에서 최적의 경험을 제공합니다.</p>
          </div>
        </template>

        <template #footer>
          <div class="text-right">
            <Button class="p-button-secondary p-button-text" label="홈화면으로 돌아가기" @click="moveToHome" />
            <Button class="p-button-info" label="계속 이용하기" @click="keepGoing" />
          </div>
        </template>
      </Card>
    </div>
  </Teleport>
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

<style scoped></style>
