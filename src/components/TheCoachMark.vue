<template>
  <div
    v-if="isVisible"
    class="absolute inset-0 flex flex-col bg-black bg-opacity-80 items-center justify-end"
  >
    <Card class="relative mb-24 bg-white w-5/6">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-xl">추가 정보 입력 필요</span>

          <Button
            icon="pi pi-times"
            class="p-button-text p-button-secondary p-button-sm"
            @click="handleClose"
          />
        </div>
      </template>

      <template #content>
        <div class="text-lg break-keep">
          출석 입력을 위해 필요한
          <span class="text-yellow-500">추가 정보를 입력</span>한 후
          <span class="text-yellow-500">승인</span>을 기다려주세요.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits(['close']);

const handleClose = () => emit('close');
</script>

<style scoped>
.p-component.p-card::after {
  position: absolute;
  right: 10%;
  content: '';
  border-top: 10px solid white;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-bottom: 0 solid transparent;
}
</style>
