<template>
  <AdminDataTableHeader
    :selection="selectionRef"
    @export="exportDataTable"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />

  <DataTable
    ref="dataTableRef"
    lazy
    rowHover
    edit-mode="cell"
    :value="dataSource"
    :loading="isLoading"
    v-model:selection="selectionRef"
    responsiveLayout="scroll"
    @update:selection="handleUpdateSelection"
    @cell-edit-complete="onCellEditComplete"
  >
    <Column selectionMode="multiple" :exportable="false" />

    <Column header="이름" field="name" style="min-width: 6rem">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column header="생일" field="birth" style="min-width: 10rem">
      <template #body="slotProps">
        <span>
          {{ formatDate(slotProps.data.birth) }}
        </span>
      </template>

      <template #editor="{ data, field }">
        <Calendar showButtonBar v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column header="성별" field="gender" style="min-width: 8rem">
      <template #body="slotProps">
        <span>
          {{ formatGender(slotProps.data.gender) }}
        </span>
      </template>

      <template #editor="{ data, field }">
        <Dropdown
          v-model="data[field]"
          :options="[
            { label: '남자', value: 'male' },
            { label: '여자', value: 'female' },
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </template>
    </Column>

    <Column header="학년" field="grade" style="min-width: 6rem">
      <template #editor="{ data, field }">
        <Dropdown
          v-model="data[field]"
          :options="[
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </template>
    </Column>

    <Column header="학급" field="group" style="min-width: 6rem">
      <template #editor="{ data, field }">
        <Dropdown
          v-model="data[field]"
          :options="[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
            { label: '6', value: '6' },
            { label: '7', value: '7' },
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </template>
    </Column>

    <Column header="연락처" field="phone" style="min-width: 6rem" />

    <Column header="주소" field="address" style="min-width: 15rem">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column header="등록일" field="registeredAt" style="min-width: 10rem">
      <template #body="slotProps">
        <span>
          {{ formatDate(slotProps.data.registeredAt) }}
        </span>
      </template>

      <template #editor="{ data, field }">
        <Calendar showButtonBar v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column header="비고" field="remark" style="min-width: 15rem">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>
  </DataTable>

  <Toast />
</template>

<script setup lang="ts">
import AdminDataTableHeader from '@/views/Admin/AdminDataTableHeader.vue';

import { ref, watch } from 'vue';
import { formatDate, formatGender } from '@/utils/useFormat';

import { useToast } from 'primevue/usetoast';
import type DataTable from 'primevue/datatable';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable/DataTable';
import type { MemberData, UserData } from '@/types';

const props = defineProps<{
  dataSource: MemberData[] | UserData[];
  isLoading: boolean;
  selectedColumns: any;
  selection: MemberData[];
}>();

const emit = defineEmits(['add', 'edit', 'delete', 'toggle']);

const handleAdd = () => emit('add');
const handleEdit = () => emit('edit');
const handleDelete = () => emit('delete');

const dataTableRef = ref<DataTable | null>(null);
const exportDataTable = () => {
  if (dataTableRef.value) dataTableRef.value.exportCSV();
};

// 상위 컴포넌트에서 받아온 props에 twoway-binding을 하기 위해서는 한 번 더 감싸줘야한다
// TODO: 더 깔끔한 방법이 있을지 고민해보자
const selectionRef = ref(props.selection);

watch(
  () => props.selection,
  (newValue) => (selectionRef.value = newValue),
  { deep: true }
);

const handleUpdateSelection = () => emit('toggle', selectionRef.value);

// CONTINUE HERE
const toast = useToast();
const onCellEditComplete = (event: DataTableCellEditCompleteEvent) => {
  const { data, newValue, field } = event;

  toast.add({
    severity: 'success',
    summary: `${data.name}`,
    detail: '수정되었습니다',
    life: 2000,
  });
};
</script>

<style scoped>
:deep(td.p-editable-column.p-cell-editing) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
