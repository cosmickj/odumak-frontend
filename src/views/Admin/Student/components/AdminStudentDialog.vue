<template>
  <Dialog
    v-model:visible="dialog.status"
    modal
    maximizable
    :breakpoints="{ '450px': '90vw' }"
    @hide="handleHide"
  >
    <template #header>
      <div class="flex gap-x-4 items-center">
        <span class="text-xl">{{ dialog.label }}</span>
        <Button
          class="p-button-success"
          label="학생 추가"
          @click="handleSubmit('EDIT')"
        />
        <Button
          class="p-button-warning"
          label="제출하기"
          @click="handleSubmit('EDIT')"
        />
      </div>
    </template>

    <div class="flex gap-x-4 items-center">
      <div>
        <p>학년</p>
        <Dropdown
          v-model="selectedStudent.grade"
          :class="{ 'p-invalid': errors.grade.status }"
          :options="GRADE"
          option-label="label"
          option-value="value"
          placeholder="학년"
        />
      </div>

      <div>
        <p>학반</p>
        <Dropdown
          v-model="selectedStudent.group"
          :class="{ 'p-invalid': errors.group.status }"
          placeholder="학급"
          option-label="label"
          option-value="value"
          :options="GROUP"
        />
      </div>

      <div>
        <p>이름</p>
        <InputText
          v-model="selectedStudent.name"
          :class="{ 'p-invalid': errors.name.status }"
          placeholder="이름을 입력해주세요."
        />
      </div>

      <div>
        <p class="flex items-center">
          생년월일
          <!-- <InputSwitch v-model="isChecked" class="ml-4" input-id="later" />
            <label class="ml-1 cursor-pointer select-none" for="later">
              다음에 입력할게요
            </label> -->
        </p>
        <div class="flex">
          <Dropdown
            v-model="selectedBirthYear"
            option-label="label"
            option-value="value"
            :disabled="isChecked"
            :options="BIRTH_YEAR"
            @change="handleBirthChange"
          />

          <Dropdown
            v-model="selectedBirthMonth"
            option-label="label"
            option-value="value"
            :disabled="isChecked"
            :options="BIRTH_MONTH"
            @change="handleBirthChange"
          />

          <Dropdown
            v-model="selectedBirthDate"
            option-label="label"
            option-value="value"
            :disabled="isChecked"
            :options="BIRTH_DATE"
            @change="handleBirthChange"
          />
        </div>
      </div>

      <div>
        <p>성별</p>
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
      </div>

      <div>
        <p>연락처(- 없이 입력)</p>
        <InputMask
          v-model="selectedStudent.phone"
          mask="(999)-9999-9999"
          placeholder="(010)-0000-0000"
        />
      </div>

      <div>
        <p>누구의 연락처인가요?</p>
        <InputText placeholder="ex) 엄마, 아빠 등등" />
      </div>

      <div>
        <p>어디 사는 친구인가요?</p>
        <InputText
          v-model="selectedStudent.address"
          placeholder="주소를 입력해주세요."
        />
      </div>

      <div class="shrink-0">
        <p>초등부를 처음 나온 날</p>

        <Calendar
          v-model="selectedStudent.registeredAt"
          date-format="yy년 mm월 dd일"
          touchUI
        />
      </div>

      <div>
        <p>비고</p>
        <InputText v-model="selectedStudent.remark" />
      </div>

      <div>
        <p>삭제</p>
        <Button class="p-button-danger" label="X" />
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
