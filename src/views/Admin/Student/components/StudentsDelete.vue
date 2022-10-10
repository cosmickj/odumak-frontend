<template>
  <Dialog class="w-2/5" v-model:visible="dialog.status" header="삭제하기" modal>
    <div class="flex items-center text-xl">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="selectedStudents">
        정말로 선택한 어린이들을 삭제하시겠습니까?
      </span>
    </div>
    <template #footer>
      <Button
        label="아니요"
        icon="pi pi-times"
        class="p-button-text"
        @click="handelCancel"
      />
      <Button
        label="네"
        icon="pi pi-check"
        class="p-button-text"
        @click="handelConfirm"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
defineProps<{
  dialog: {
    status: boolean;
    label: string;
  };
  selectedStudents: any;
}>();

const emit = defineEmits(['cancel', 'confirm']);

const handelCancel = () => emit('cancel');

const handelConfirm = () => emit('confirm');
</script>
