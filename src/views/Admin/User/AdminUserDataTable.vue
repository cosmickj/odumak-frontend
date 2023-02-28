<template>
  <div class="flex mb-6 justify-between">
    <div class="flex gap-x-3">
      <Button
        class="p-button-success p-button-sm"
        icon="pi pi-verified"
        label="승인하기"
        :disabled="!isSelected"
        @click="handleAccept"
      />
      <Button
        class="p-button-danger p-button-sm"
        icon="pi pi-times-circle"
        label="거절하기"
        :disabled="!isSelected"
        @click="handleReject"
      />
    </div>

    <Button
      class="p-button-help p-button-sm"
      icon="pi pi-external-link"
      label="내보내기"
    />
  </div>

  <DataTable
    lazy
    row-hover
    resizable-columns
    column-resize-mode="fit"
    responsive-layout="scroll"
    v-model:selection="selection"
    :value="users"
    :loading="loading"
  >
    <template #empty>
      <p>등록된 인원이 없습니다.</p>
    </template>

    <Column selectionMode="multiple" :exportable="false" />

    <Column header="이름" field="name" />
    <Column header="학년" field="grade" />
    <Column header="학급" field="group" />
    <Column header="담임 여부" field="role" />
    <Column header="생일" field="birth" />
    <Column header="연락처" field="phone" />
    <Column header="가입일" field="registeredAt" />
    <Column header="가입 승인 여부" field="isAccepted">
      <template #body="slotProps">
        <Button
          v-if="slotProps.data.isRejected"
          label="승인 거절"
          class="p-button-text p-button-sm p-button-danger"
        />
        <Button
          v-else-if="slotProps.data.isAccepted"
          label="승인 완료"
          class="p-button-text p-button-sm p-button-success"
        />
        <Button
          v-else
          label="승인 대기중"
          class="p-button-text p-button-sm p-button-help"
        />
      </template>
    </Column>
    <Column header="가입 거절 사유" field="rejectedReason" />
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserData } from '@/types';

const props = defineProps<{
  loading: boolean;
  users: UserData[];
  usersSelection: UserData[];
}>();

const emit = defineEmits(['update:usersSelection', 'accept', 'reject']);

const selection = computed({
  get() {
    return props.usersSelection;
  },
  set(newValue) {
    emit('update:usersSelection', newValue);
  },
});

const isSelected = computed(() => {
  if (selection.value.length > 0) {
    return true;
  }
  return false;
});

const handleAccept = () => emit('accept');
const handleReject = () => emit('reject');
</script>

<style scoped></style>
