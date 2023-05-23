<template>
  <AdminDataTableHeader
    :selection="selectionRef"
    @export="exportDataTable"
    @add="handleAdd"
    @delete="handleDelete"
  />

  <DataTable
    ref="dataTableRef"
    row-hover
    resizable-columns
    column-resize-mode="fit"
    responsive-layout="scroll"
    edit-mode="cell"
    paginator
    :rows="10"
    :rows-per-page-options="[5, 10, 15, 20]"
    :value="dataSource"
    :loading="isLoading"
    v-model:selection="selectionRef"
    @update:selection="handleSelect"
    @cell-edit-complete="handleEdit"
  >
    <template #empty>
      <p>등록된 인원이 없습니다.</p>
    </template>

    <Column selectionMode="multiple" :exportable="false" />

    <Column
      v-if="columnState['name']"
      field="name"
      header="이름"
      style="min-width: 6rem"
    >
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column
      v-if="columnState['birth']"
      field="birth"
      header="생일"
      style="min-width: 10rem"
    >
      <template #body="slotProps">
        <span>
          {{ formatDate(slotProps.data.birth) }}
        </span>
      </template>

      <template #editor="{ data, field }">
        <Calendar showButtonBar v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column
      v-if="columnState['gender']"
      field="gender"
      header="성별"
      style="min-width: 8rem"
    >
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

    <Column
      v-if="columnState['grade']"
      header="학년"
      field="grade"
      style="min-width: 8rem"
    >
      <template #editor="{ data, field }">
        <Dropdown
          v-model="data[field]"
          :options="[
            { label: '새친구', value: '0' },
            { label: '3학년', value: '3' },
            { label: '4학년', value: '4' },
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </template>
    </Column>

    <Column
      v-if="columnState['group']"
      header="학급"
      field="group"
      style="min-width: 8rem"
    >
      <template #editor="{ data, field }">
        <Dropdown
          v-model="data[field]"
          :options="[
            { label: '새친구', value: '0' },
            { label: '1반', value: '1' },
            { label: '2반', value: '2' },
            { label: '3반', value: '3' },
            { label: '4반', value: '4' },
            { label: '5반', value: '5' },
            { label: '6반', value: '6' },
            { label: '7반', value: '7' },
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </template>
    </Column>

    <Column
      v-if="columnState['phone']"
      header="연락처"
      field="phone"
      style="min-width: 6rem"
    >
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column
      v-if="columnState['address']"
      header="주소"
      field="address"
      style="min-width: 15rem"
    >
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column
      v-if="columnState['registeredAt']"
      header="등록일"
      field="registeredAt"
      style="min-width: 10rem"
    >
      <template #body="slotProps">
        <span>
          {{ formatDate(slotProps.data.registeredAt) }}
        </span>
      </template>

      <template #editor="{ data, field }">
        <Calendar showButtonBar v-model="data[field]" class="w-full" />
      </template>
    </Column>

    <Column
      v-if="columnState['remark']"
      header="비고"
      field="remark"
      style="min-width: 15rem"
    >
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" class="w-full" />
      </template>
    </Column>
  </DataTable>

  <Toast />
</template>

<script setup lang="ts">
import AdminDataTableHeader from '@/views/Admin/_partials/AdminDataTableHeader.vue';

import { ref, watch } from 'vue';
import { formatDate, formatGender } from '@/utils/useFormat';

import type DataTable from 'primevue/datatable';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable/DataTable';
import type { MemberData } from '@/types';

const props = defineProps<{
  isLoading: boolean;
  dataSource: MemberData[];
  selection?: any[];
  columnState: {
    [field: string]: boolean;
  };
}>();

const emit = defineEmits(['add', 'edit', 'delete', 'select']);

const handleAdd = () => emit('add');
const handleEdit = (ev: DataTableCellEditCompleteEvent) => emit('edit', ev);
const handleDelete = () => emit('delete');
const handleSelect = () => emit('select', selectionRef.value);

const dataTableRef = ref<DataTable | null>(null);
const exportDataTable = () => {
  if (dataTableRef.value) dataTableRef.value.exportCSV();
};

const selectionRef = ref(props.selection);

watch(
  () => props.selection,
  (newValue) => (selectionRef.value = newValue),
  { deep: true }
);
</script>

<style scoped>
:deep(td.p-editable-column.p-cell-editing) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
