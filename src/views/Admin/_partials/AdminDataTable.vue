<template>
  <AdminDataTableHeader
    :selection="selectionRef"
    @add="handleAdd"
    @delete="handleDelete"
    @export="exportDataTable"
  />

  <div class="bg-[#dadde2]">
    <DataTable
      ref="dataTableRef"
      row-group-mode="subheader"
      :group-rows-by="groupRowsBy"
      row-hover
      scrollable
      scroll-height="calc(100vh - 95px)"
      :value="dataSource"
      :loading="isLoading"
      v-model:selection="selectionRef"
      @update:selection="handleSelect"
    >
      <template #empty>
        <p>등록된 인원이 없습니다.</p>
      </template>

      <template #groupheader="slotProps">
        <div>
          <i class="pi pi-users"></i>
          <span class="ml-4">{{ formatClass(slotProps.data) }}</span>
        </div>
      </template>

      <Column selectionMode="multiple" :exportable="false" />

      <Column field="name" header="이름" style="min-width: 8rem" />

      <Column field="grade" header="학년" style="min-width: 4.2rem" />

      <Column field="group" header="학급" style="min-width: 4.2rem" />

      <Column field="gender" header="성별" style="min-width: 4.2rem">
        <template #body="{ data: { gender } }">
          <Tag
            :value="formatGender(gender)"
            :severity="gender === 'male' ? 'primary' : 'danger'"
          />
        </template>
      </Column>

      <Column field="birth" header="생일" style="min-width: 9rem">
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.birth) }}</span>
        </template>
      </Column>

      <Column header="등록일" field="registeredAt" style="min-width: 9rem">
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.registeredAt) }}</span>
        </template>
      </Column>

      <Column header="비고" field="remark" style="min-width: 8rem" />

      <Column>
        <template #body="slotProps">
          <Button
            text
            size="small"
            severity="info"
            icon="pi pi-pencil"
            class="w-6 aspect-square"
            @click="showEditDialog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      modal
      v-model:visible="editVisible"
      header="수정하기"
      position="right"
      :closable="false"
      :draggable="false"
      :style="{ width: '40vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    >
      <div class="flex flex-col gap-2">
        <div class="flex gap-6 items-center">
          <InputText class="flex-1 w-full" v-model="editMember.name" />

          <div class="flex-1 flex items-center">
            <RadioButton
              v-model="editMember.gender"
              input-id="male"
              name="gender"
              value="male"
            />
            <label for="male">남자</label>

            <RadioButton
              class="ml-2"
              v-model="editMember.gender"
              input-id="female"
              name="gender"
              value="female"
            />
            <label for="female">여자</label>
          </div>
        </div>

        <div>
          <label for="role" class="mb-1">담임 여부</label>
          <SelectButton
            unselectable
            class="flex"
            v-model="editMember.role"
            :options="TEACHER_ROLE"
            optionLabel="label"
            optionValue="value"
            placeholder="담당 학년"
          />
        </div>

        <div>
          <p>학년반</p>
          <div class="flex gap-6">
            <Dropdown
              class="flex-1"
              v-model="editMember.grade"
              :options="[
                { label: '새친구', value: '0' },
                { label: '3학년', value: '3' },
                { label: '4학년', value: '4' },
              ]"
              optionLabel="label"
              optionValue="value"
            />

            <Dropdown
              class="flex-1"
              v-model="editMember.group"
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
          </div>
        </div>

        <div>
          <div class="flex items-center">
            <label class="mr-auto" for="birth">생년월일</label>

            <InputSwitch id="birthLater" v-model="editMember.birthLater" />
            <label class="ml-2" for="birthLater">나중에 입력</label>
          </div>

          <Calendar
            id="birth"
            class="w-full"
            touch-u-i
            showButtonBar
            v-model="editMember.birth"
            :disabled="editMember.birthLater"
            placeholder="생년월일을 입력해주세요"
          />
        </div>

        <div>
          <label for="registeredAt">등록일</label>
          <Calendar
            id="registeredAt"
            class="w-full"
            touch-u-i
            showButtonBar
            v-model="editMember.registeredAt"
          />
        </div>

        <div>
          <label for="remark">비고</label>
          <InputText id="remark" class="w-full" v-model="editMember.remark" />
        </div>
      </div>

      <template #footer>
        <Button
          text
          label="취소하기"
          icon="pi pi-times"
          @click="editVisible = false"
        />
        <Button
          label="제출하기"
          severity="warning"
          icon="pi pi-check"
          @click="editVisible = false"
        />
      </template>
    </Dialog>
  </div>

  <Toast />
</template>

<script setup lang="ts">
import AdminDataTableHeader from '@/views/Admin/_partials/AdminDataTableHeader.vue';

import { onMounted, ref, watch } from 'vue';
import { formatDate, formatGender, formatClass } from '@/utils/useFormat';
import { TEACHER_ROLE } from '@/constants/common';
import type { MemberData } from '@/types';

import type DataTable from 'primevue/datatable';
import type { DataTableRowEditSaveEvent } from 'primevue/datatable/DataTable';

const props = defineProps<{
  isLoading: boolean;
  dataSource: MemberData[];
  selection: MemberData[];
  columnState?: {
    [field: string]: boolean;
  };
}>();

const emit = defineEmits(['add', 'edit', 'delete', 'select']);

const handleAdd = () => emit('add');
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

onMounted(() => {
  setTimeout(() => {
    const headers = document.querySelectorAll('.p-rowgroup-header td');

    Array.from(headers).forEach((rowHeader) => {
      rowHeader.setAttribute('colspan', '9');
    });
  }, 300);
});

const groupRowsBy = ({ grade, group }: MemberData) => {
  return `${grade} ${group}`;
};

const editVisible = ref(false);
const editMember = ref<Partial<MemberData>>({});

const showEditDialog = (data: MemberData) => {
  editVisible.value = true;
  editMember.value = { ...data };
};
</script>

<style scoped>
:deep(td.p-editable-column.p-cell-editing) {
  padding-top: 0;
  padding-bottom: 0;
}
:deep(tr.p-rowgroup-header) {
  position: unset !important;
  background: #dadde2;
}
:deep(tr.p-rowgroup-header > td) {
  padding: 8px 16px !important;
}
</style>
