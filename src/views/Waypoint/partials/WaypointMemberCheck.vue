<template>
  <div class="flex-1 flex flex-col justify-between">
    <div>
      <p class="break-keep">
        {{ formState.church }} {{ formState.department }} 000 선생님이
        맞으시다면 담당 학생을 모두 선택 후 제출하기를 눌러주세요
      </p>

      <div class="grid grid-cols-3 gap-3 p-4">
        <ToggleButton
          v-for="(item, i) in items"
          class="flex aspect-square bg-white rounded-md items-center justify-center shadow"
          v-model="item.checked"
          :on-label="item.name"
          :off-label="item.name"
          :key="i"
        />
      </div>
    </div>

    <div class="flex justify-between">
      <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button severity="success" label="제출하기" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  formState: any;
}>();

const emit = defineEmits(['prevPage', 'nextPage']);

const items = ref([
  { name: 'aaa', checked: false },
  { name: 'bbb', checked: false },
  { name: 'cccc', checked: false },
  { name: 'ddd', checked: false },
  { name: 'eee', checked: false },
  { name: 'fff', checked: false },
  { name: 'ggg', checked: false },
  { name: 'hhh', checked: false },
  { name: 'iii', checked: false },
]);

const prevPage = () => {
  emit('prevPage', { index: 2 });
};

const nextPage = async () => {
  emit('nextPage', { index: 2 });
};
</script>

<style scoped></style>
