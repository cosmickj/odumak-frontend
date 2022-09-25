<template>
  <DataTable
    :value="dataSource"
    v-model:selection="selectedStudents"
    :lazy="true"
    :loading="isLoading"
    :rowHover="true"
    :row-class="() => 'cursor-pointer'"
    sortMode="multiple"
    removableSort
    responsiveLayout="scroll"
    @row-click="handleRowClick"
  >
    <template #header>
      <div>
        <span class="mr-5">*보고 싶은 컬럼을 선택하세요:</span>

        <MultiSelect
          class="w-1/4"
          :modelValue="selectedColumns"
          :options="columns"
          optionLabel="header"
          placeholder="Select Columns"
          @update:modelValue="onToggle"
        />
      </div>
    </template>

    <Column class="w-12" selectionMode="multiple" :exportable="false" />

    <Column
      v-for="(column, idx) in selectedColumns"
      :key="idx"
      :field="column.field"
      :header="column.header"
      :sortable="column.sortable"
    >
      <template #body="slotProps">
        <span v-if="column.formatter">
          {{ column.formatter(slotProps.data[column.field]) }}
        </span>

        <span v-else>
          {{ slotProps.data[column.field] }}
        </span>
      </template>
    </Column>

    <Column :exportable="false">
      <template #body="slotProps">
        <div class="flex justify-center">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mx-6"
            @click="handelEdit(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-warning mx-6"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DataTableRowClickEvent } from 'primevue/datatable/DataTable';

defineProps<{
  dataSource: any;
  isLoading: boolean;
}>();

const emit = defineEmits(['edit', 'rowClick']);

const formatGender = (value: 'male' | 'female') => {
  if (value === 'male') return '남자';
  else if (value === 'female') return '여자';
};

const formatBirth = (seconds: number | undefined) => {
  if (seconds) return new Date(seconds * 1000);
  else return;
};

const columns = ref([
  { field: 'grade', header: '학년', sortable: true, formatter: undefined },
  { field: 'group', header: '학급', sortable: true, formatter: undefined },
  { field: 'name', header: '이름', sortable: true, formatter: undefined },
  { field: 'gender', header: '성별', sortable: false, formatter: formatGender },
  { field: 'phone', header: '연락처', sortable: false, formatter: undefined },
  {
    field: 'teacher',
    header: '담당 교사',
    sortable: true,
    formatter: undefined,
  },
  { field: 'address', header: '주소', sortable: true, formatter: undefined },
  { field: 'remark', header: '비고', sortable: false, formatter: undefined },
]);

const selectedStudents = ref();

const selectedColumns = ref(columns.value);

const onToggle = (value: any) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
};

interface Student {
  grade: string;
  group: string;
  name: string;
  gender: string;
  phone: string;
  teacher: string;
  address: string;
  remark: string;
}

const handelEdit = (student: Student) => {
  emit('edit', { ...student });
};

const handleRowClick = (ev: DataTableRowClickEvent) => {
  // if (ev.data.birth) {
  //   ev.data.birth = formatBirth(ev.data.birth.seconds);
  // }
  // emit('rowClick', { index: ev.index, ...ev.data });
};
</script>
