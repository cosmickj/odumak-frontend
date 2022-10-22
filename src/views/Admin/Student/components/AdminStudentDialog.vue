<template>
  <Dialog
    v-model:visible="dialog.status"
    class="w-2/5"
    modal
    maximizable
    :breakpoints="{ '450px': '75vw' }"
    :header="dialog.label"
    @hide="handleHide"
  >
    <div class="min-w-full">
      <div class="grid grid-cols-4 gap-x-12 gap-y-5">
        <div class="col-span-2">
          <p>몇 학년 인가요?</p>
          <Dropdown
            v-model="selectedStudent.grade"
            class="w-full"
            :class="{ 'p-invalid': errors.grade.status }"
            :options="GRADE"
            option-label="label"
            option-value="value"
            placeholder="학년"
          />
        </div>

        <div class="col-span-2">
          <p>몇 반 인가요?</p>
          <Dropdown
            v-model="selectedStudent.group"
            class="w-full"
            :class="{ 'p-invalid': errors.group.status }"
            placeholder="학급"
            option-label="label"
            option-value="value"
            :options="GROUP"
          />
        </div>

        <div class="col-span-4">
          <p>담당 교사</p>
          <InputText
            v-model="selectedStudent.teacher"
            class="w-full"
            :class="{ 'p-invalid': errors.teacher.status }"
            disabled
            placeholder="학년과 학급을 선택하시면 자동으로 입력됩니다."
          />
        </div>

        <div class="col-span-4">
          <p>이름</p>
          <InputText
            v-model="selectedStudent.name"
            class="w-full"
            :class="{ 'p-invalid': errors.name.status }"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <div class="col-span-4">
          <p class="mb-2 flex items-center">
            생년월일이 언제인가요?
            <InputSwitch v-model="isChecked" class="ml-4" input-id="later" />
            <label class="ml-1 cursor-pointer select-none" for="later">
              다음에 입력할게요
            </label>
          </p>
          <div class="flex gap-x-8 items-center">
            <Dropdown
              v-model="selectedBirthYear"
              class="w-full"
              option-label="label"
              option-value="value"
              :disabled="isChecked"
              :options="BIRTH_YEAR"
              @change="handleBirthChange"
            />

            <Dropdown
              v-model="selectedBirthMonth"
              class="w-full"
              option-label="label"
              option-value="value"
              :disabled="isChecked"
              :options="BIRTH_MONTH"
              @change="handleBirthChange"
            />

            <Dropdown
              v-model="selectedBirthDate"
              class="w-full"
              option-label="label"
              option-value="value"
              :disabled="isChecked"
              :options="BIRTH_DATE"
              @change="handleBirthChange"
            />
          </div>
        </div>

        <div class="col-span-4">
          <p>성별</p>
          <div class="flex items-center">
            <RadioButton
              name="gender"
              inputId="male"
              value="male"
              v-model="selectedStudent.gender"
            />
            <label class="cursor-pointer" for="male"> 남자 어린이 </label>

            <RadioButton
              name="gender"
              inputId="female"
              value="female"
              v-model="selectedStudent.gender"
            />
            <label class="cursor-pointer" for="female"> 여자 어린이 </label>
          </div>
        </div>

        <div class="col-span-2">
          <p>연락처</p>
          <InputMask
            class="w-full"
            v-model="selectedStudent.phone"
            mask="(999)-9999-9999"
            placeholder="(010)-0000-0000"
          />
        </div>

        <div class="col-span-2">
          <p>누구의 연락처인가요?</p>
          <InputText class="w-full" placeholder="ex) 엄마, 아빠 등등" />
        </div>

        <div class="col-span-4">
          <p>어디 사는 친구인가요?</p>
          <InputText
            class="w-full"
            v-model="selectedStudent.address"
            placeholder="주소를 입력해주세요."
          />
        </div>

        <div class="col-span-4">
          <p>언제 초등부를 처음 나왔나요?</p>
          <Calendar
            v-model="selectedStudent.registeredAt"
            class="w-full"
            date-format="yy년 mm월 dd일"
            touchUI
          />
        </div>

        <div class="col-span-4">
          <p>비고</p>
          <InputText class="w-full" v-model="selectedStudent.remark" />
        </div>

        <div class="col-span-4">
          <Button
            v-if="dialog.label === '수정하기'"
            class="p-button-warning w-full"
            :label="dialog.label"
            @click="handleSubmit('EDIT')"
          />
          <Button
            v-else-if="dialog.label === '추가하기'"
            class="p-button-success w-full"
            :label="dialog.label"
            @click="handleSubmit('ADD')"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
    label: string;
  };
  selectedStudent: Student;
  errors: any;
}>();

const emit = defineEmits(['hide', 'submit', 'birthChange']);

const isChecked = ref(false);

const selectedBirthYear = ref(
  props.selectedStudent.birth.getFullYear().toString()
);

const selectedBirthMonth = ref(
  (props.selectedStudent.birth.getMonth() + 1).toString()
);

const selectedBirthDate = ref(props.selectedStudent.birth.getDate().toString());

const handleBirthChange = () => {
  const selectedBirthString = `${selectedBirthYear.value}-${selectedBirthMonth.value}-${selectedBirthDate.value}`;
  emit('birthChange', { birth: new Date(selectedBirthString) });
};

const handleSubmit = (submitType: SubmitType) => emit('submit', { submitType });

const handleHide = () => emit('hide');
</script>

<style>
.p-dropdown-panel {
  overflow: hidden;
}
</style>
