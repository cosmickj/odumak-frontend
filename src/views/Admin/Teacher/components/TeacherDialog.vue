<template>
  <Dialog
    v-model:visible="dialog.status"
    class="overflow-hidden w-2/5"
    modal
    maximizable
    :breakpoints="{ '450px': '75vw' }"
    :header="dialog.label"
    @hide="handleHide"
  >
    <div class="min-w-full">
      <div class="grid grid-cols-4 gap-x-12 gap-y-5">
        <div class="col-span-2">
          <p class="mb-2">몇 학년을 담당하시는가요?</p>
          <Dropdown
            v-model="selectedTeacher.grade"
            class="w-full"
            :class="{ 'p-invalid': errors.grade.status }"
            :options="GRADE"
            option-label="label"
            option-value="value"
            placeholder="학년"
          />
        </div>

        <div class="col-span-2">
          <p class="mb-2">몇 학급을 담당하시는가요?</p>
          <Dropdown
            v-model="selectedTeacher.group"
            class="w-full"
            :class="{ 'p-invalid': errors.group.status }"
            placeholder="학급"
            option-label="label"
            option-value="value"
            :options="GROUP"
          />
        </div>

        <div class="col-span-4">
          <p class="mb-2">이름</p>
          <InputText
            v-model="selectedTeacher.name"
            class="w-full"
            :class="{ 'p-invalid': errors.name.status }"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <div class="col-span-4">
          <p class="mb-2">학급 담임 여부를 체크해주세요.</p>
          <div class="flex gap-x-4 items-center">
            <div class="flex gap-x-1 items-center">
              <RadioButton
                name="role"
                inputId="main"
                value="main"
                v-model="selectedTeacher.role"
              />
              <label class="cursor-pointer" for="main">담임</label>
            </div>

            <div class="flex gap-x-1 items-center">
              <RadioButton
                name="role"
                inputId="sub"
                value="sub"
                v-model="selectedTeacher.role"
              />
              <label class="cursor-pointer" for="sub">부담임</label>
            </div>

            <div class="flex gap-x-1 items-center">
              <RadioButton
                name="role"
                inputId="common"
                value="common"
                v-model="selectedTeacher.role"
              />
              <label class="cursor-pointer" for="common">미담당</label>
            </div>
          </div>
        </div>

        <div class="col-span-4">
          <p class="mb-2 flex items-center">
            생년월일이 어떻게 되나요?
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
          <p class="mb-2">성별</p>
          <div class="flex gap-x-4 items-center">
            <div class="flex gap-x-1 items-center">
              <RadioButton
                name="gender"
                inputId="male"
                value="male"
                v-model="selectedTeacher.gender"
              />
              <label class="cursor-pointer" for="male"> 남자 선생님 </label>
            </div>

            <div class="flex gap-x-1 items-center">
              <RadioButton
                name="gender"
                inputId="female"
                value="female"
                v-model="selectedTeacher.gender"
              />
              <label class="cursor-pointer" for="female"> 여자 선생님 </label>
            </div>
          </div>
        </div>

        <div class="col-span-4">
          <p class="mb-2">연락처</p>
          <InputMask
            class="w-full"
            v-model="selectedTeacher.phone"
            mask="(999)-9999-9999"
            placeholder="(010)-0000-0000"
          />
        </div>

        <div class="col-span-4">
          <p class="mb-2">
            추가하려는 선생님께서 언제 처음 초등부와 함께 하였나요?
          </p>
          <Calendar
            v-model="selectedTeacher.registeredAt"
            class="w-full"
            touchUI
            date-format="yy년 mm월 dd일"
            :manual-input="false"
          />
        </div>

        <div class="col-span-4">
          <p class="mb-2">비고</p>
          <InputText class="w-full" v-model="selectedTeacher.remark" />
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
import { SubmitType, Teacher } from '@/types';
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
  selectedTeacher: Teacher;
  errors: any;
}>();

const emit = defineEmits(['hide', 'submit', 'birthChange']);

const isChecked = ref(false);

const selectedBirthYear = ref(
  props.selectedTeacher.birth.getFullYear().toString()
);

const selectedBirthMonth = ref(
  (props.selectedTeacher.birth.getMonth() + 1).toString()
);

const selectedBirthDate = ref(props.selectedTeacher.birth.getDate().toString());

const handleBirthChange = () => {
  const selectedBirthString = `${selectedBirthYear.value}-${selectedBirthMonth.value}-${selectedBirthDate.value}`;
  emit('birthChange', { birth: new Date(selectedBirthString) });
};

const handleHide = () => emit('hide');

const handleSubmit = (submitType: SubmitType) => emit('submit', { submitType });
</script>

<style>
.p-dropdown-panel {
  overflow: hidden;
}
</style>
