<template>
  <div class="container">
    <div class="mb-12">
      <Button
        class="p-button-success mr-2"
        icon="pi pi-plus"
        label="추가하기"
        @click="openDialogForAddTeacher"
      />
      <Button
        class="p-button-danger"
        icon="pi pi-trash"
        label="삭제하기"
        :disabled="!selectedTeachers.length"
      />
    </div>
  </div>

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        :value="dataSource"
        :lazy="true"
        :loading="isLoading"
        :rowHover="true"
        responsiveLayout="scroll"
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

        <Column
          v-for="(column, idx) in selectedColumns"
          :key="idx"
          :field="column.field"
          :header="column.header"
          :sortable="column.sortable"
        >
          <template #body="slotProps">
            <span v-if="column.format">
              {{ column.format(slotProps.data[column.field]) }}
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
                @click=""
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mx-6"
                @click=""
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <TeacherDialog
    :dialog="addEditDialog"
    :selected-teacher="selectedTeacher"
    @submit=""
  />
</template>

<script setup lang="ts">
import TeacherDialog from './components/TeacherDialog.vue';
import { onMounted, reactive, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { v4 as uuidv4 } from 'uuid';
import { Teacher } from '@/types';

const accountStore = useAccountStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    if (accountStore.userData) {
      const result = await memberStore.fetchAll({
        church: accountStore.userData.church,
        department: accountStore.userData.department,
        position: 'teacher',
      });
      dataSource.value = result;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const columns = ref([
  { field: 'grade', header: '담당 학년', sortable: true, format: undefined },
  { field: 'group', header: '담당 학급', sortable: true, format: undefined },
  { field: 'name', header: '이름', sortable: true, format: undefined },
  { field: 'role', header: '담임 여부', sortable: false, format: undefined },
  { field: 'remark', header: '비고', sortable: false, format: undefined },
]);

const selectedColumns = ref(columns.value);

const onToggle = (value: any) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
};

// || 생성 혹은 수정하기
const addEditDialog = reactive({
  label: '',
  status: false,
});

const initSelectedTeacher: Teacher = {
  _id: '',
  grade: '',
  group: '',
  name: '',
  role: 'common',
  remark: '',
  registeredAt: new Date(),
};

const selectedTeacher = reactive({ ...initSelectedTeacher });

const selectedTeachers = ref<Teacher[]>([]);

const resetSelectedTeacher = () => {
  // TODO: 3번째 매개변수에 대해서 타입체킹이 되지 않는다
  Object.assign(selectedTeacher, initSelectedTeacher, { _id: uuidv4() });
};

const openDialogForAddTeacher = () => {
  resetSelectedTeacher();
  addEditDialog.status = true;
  addEditDialog.label = '추가하기';
};

onMounted(async () => {
  await getMembers();
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
