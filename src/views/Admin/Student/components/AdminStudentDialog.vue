<template>
  <Dialog
    v-model:visible="dialog.status"
    modal
    position="top"
    :breakpoints="{ '1280px': '90vw', '450px': '90vw' }"
    @hide="handleHide"
  >
    <template #header>
      <div class="flex gap-x-4 items-center">
        <span class="text-xl">{{ dialog.label }}</span>
        <Button
          class="p-button-success"
          label="행 추가"
          @click="handleAddRow"
        />
        <Button
          class="p-button-warning"
          label="제출하기"
          @click="handleSubmit(dialog.label)"
        />
      </div>
    </template>

    <div class="grid gap-x-5 gap-y-3 grid-cols-custom w-fit">
      <!-- Header -->
      <p class="self-baseline">학년</p>
      <p class="self-baseline">학급</p>
      <p class="self-baseline">이름</p>
      <p class="self-baseline">성별</p>
      <p class="self-baseline">생년월일</p>
      <p class="self-baseline">연락처(- 없이 입력)</p>
      <p class="self-baseline">주소</p>
      <p class="self-baseline">초등부 처음 온 날</p>
      <p class="self-baseline">비고</p>
      <p class="self-baseline">복사</p>
      <p class="self-baseline">삭제</p>

      <!-- Row -->
      <template v-for="(selectedStudent, i) in selectedStudents" :key="i">
        <Dropdown
          v-model="selectedStudent.grade"
          class="w-28"
          :class="{ 'p-invalid': isError(i, 'grade') }"
          :options="GRADE"
          option-label="label"
          option-value="value"
          placeholder="학년"
        />

        <Dropdown
          v-model="selectedStudent.group"
          class="w-28"
          :class="{ 'p-invalid': isError(i, 'group') }"
          placeholder="학급"
          option-label="label"
          option-value="value"
          :options="GROUP"
        />

        <InputText
          v-model="selectedStudent.name"
          :class="{ 'p-invalid': isError(i, 'name') }"
          placeholder="이름을 입력해주세요."
        />

        <div class="flex items-center">
          <RadioButton
            name="gender"
            inputId="male"
            value="male"
            v-model="selectedStudent.gender"
          />
          <label class="cursor-pointer" for="male"> 남 </label>
          <RadioButton
            name="gender"
            inputId="female"
            value="female"
            v-model="selectedStudent.gender"
          />
          <label class="cursor-pointer" for="female"> 여 </label>
        </div>

        <div class="flex items-center">
          <Calendar
            v-model="selectedStudent.birth"
            date-format="yy년 mm월 dd일"
          />
          <InputSwitch v-model="isChecked" class="ml-4" input-id="later" />
          <label class="cursor-pointer select-none" for="later"> 나중에 </label>
        </div>

        <InputMask
          v-model="selectedStudent.phone"
          mask="(999)-9999-9999"
          placeholder="(010)-0000-0000"
        />

        <InputText
          v-model="selectedStudent.address"
          placeholder="주소를 입력해주세요."
        />

        <Calendar
          v-model="selectedStudent.registeredAt"
          date-format="yy년 mm월 dd일"
        />

        <InputText v-model="selectedStudent.remark" />

        <Button
          class="p-button-help"
          icon="pi pi-copy"
          @click="handleCopyRow(i)"
        />

        <Button
          class="p-button-danger"
          icon="pi pi-times"
          @click="handleDeleteRow(i)"
        />
      </template>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Student, SubmitType } from '@/types';
import {
  BIRTH_DATE,
  BIRTH_MONTH,
  BIRTH_YEAR,
  GRADE,
  GROUP,
} from '@/constants/common';

const props = defineProps<{
  dialog: {
    status: boolean;
    label: SubmitType;
  };
  errors: any;
  selectedStudents: Student[];
}>();

const emit = defineEmits([
  'hide',
  'submit',
  'birthChange',
  'addRow',
  'copyRow',
  'deleteRow',
]);

const isError = (index: number, key: string) => {
  if (props.errors && props.errors[index][key].length > 0) return true;
  else return false;
};

const isChecked = ref(false);

const selectedBirthYear = ref('2022');
// props.selectedStudent.birth.getFullYear().toString()

const selectedBirthMonth = ref('12');
// (props.selectedStudent.birth.getMonth() + 1).toString()

const selectedBirthDate = ref('13');
// props.selectedStudent.birth.getDate().toString()

const handleBirthChange = () => {
  const selectedBirthString = `${selectedBirthYear.value}-${selectedBirthMonth.value}-${selectedBirthDate.value}`;
  emit('birthChange', { birth: new Date(selectedBirthString) });
};

const handleHide = () => emit('hide');

const handleAddRow = () => emit('addRow');

const handleCopyRow = (index: number) => emit('copyRow', index);

const handleDeleteRow = (index: number) => emit('deleteRow', index);

const handleSubmit = (submitType: SubmitType) => emit('submit', submitType);
</script>

<style>
.p-dropdown-panel {
  overflow: hidden;
}
</style>

<style scoped>
.grid-cols-custom {
  grid-template-columns: repeat(11, max-content);
}
</style>
