<template>
  <div v-if="deferredPrompt" class="absolute top-0 left-0 right-0 m-3">
    <div ref="download" class="download w-full border-round animate__animated animate__slideInDown bg-white">
      <div class="p-4">
        <p class="text-2xl text-center">앱을 설치하여 편하게 출석체크하세요!</p>
        <div class="mt-4 flex justify-content-end">
          <Button label="다음에" class="p-button-text p-button-plain p-button-lg" @click="handleDismiss" />
          <Button label="설치하기" class="p-button-warning p-button-lg" @click="handleDownload" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  deferredPrompt: Event | null;
}>();
const emit = defineEmits(["dismiss", "download"]);

const download = ref<HTMLDivElement>();
const handleDismiss = () => {
  download.value?.classList.add("animate__slideOutUp");
  emit("dismiss");
};
const handleDownload = () => emit("download");
</script>

<style scoped>
.download {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
