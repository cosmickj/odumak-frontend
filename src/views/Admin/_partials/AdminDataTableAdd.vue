<template>
  <TheDialog :visible="visible" @close="handleClose">
    <template #header>
      <div class="flex items-center gap-x-4">
        <Button class="p-button-success p-button-sm" label="인원 추가" @click="handleAdd" />
        <Button class="p-button-warning p-button-sm" label="제출하기" @click="handleSubmit" />
      </div>
    </template>

    <section class="grid grid-cols-3 gap-4">
      <div v-for="(member, i) in members" class="rounded bg-stone-500 p-4 text-white" :key="i">
        <div class="flex items-start">
          <div class="flex-1">
            <p class="text-lg font-bold">기본 정보</p>
          </div>

          <div class="flex-2">
            <p class="mb-2 font-bold">이름</p>
            <InputText v-model="member.name" class="w-full" :class="{ 'p-invalid': isInvalid(i, 'name') }" />

            <div class="my-2 flex gap-8">
              <p class="font-bold">성별</p>
              <div class="flex items-center">
                <RadioButton v-model="member.gender" input-id="male" name="gender" value="male" />
                <label class="ml-2 cursor-pointer" for="male">남자</label>

                <RadioButton
                  class="ml-2"
                  v-model="member.gender"
                  input-id="female"
                  name="gender"
                  value="female"
                />
                <label class="ml-2 cursor-pointer" for="female">여자</label>
              </div>
            </div>

            <div class="flex gap-8">
              <p class="mb-2 font-bold">생년월일</p>
            </div>

            <Calendar
              touch-u-i
              showButtonBar
              v-model="member.birth"
              id="birth"
              class="w-full"
              placeholder="생년월일을 선택해주세요"
              :disabled="member.birthLater"
            />

            <div class="mt-1 flex items-center">
              <Checkbox binary input-id="birthLater" v-model="member.birthLater" />
              <label class="ml-2 cursor-pointer select-none" for="birthLater"> 나중에 입력할게요 </label>
            </div>
          </div>
        </div>

        <hr class="my-3 h-1 border-0 bg-slate-200" />

        <div v-if="member.job === 'teacher'" class="flex items-start">
          <div class="flex-1">
            <p class="text-lg font-bold">담임 정보</p>
          </div>

          <div class="flex-2">
            <SelectButton
              unselectable
              class="flex"
              optionLabel="label"
              optionValue="value"
              :options="TEACHER_ROLE"
              v-model="member.role!.teacher"
            />

            <Transition>
              <div v-if="member.role!.teacher !== 'common'" class="my-2 flex items-center justify-between">
                <p>새친구 학급이신가요?</p>

                <div class="flex items-center gap-2">
                  <p>
                    {{ member.isNewFriendClass ? '네' : '아니요' }}
                  </p>
                  <InputSwitch v-model="member.isNewFriendClass" />
                </div>
              </div>
            </Transition>

            <Transition>
              <div v-if="member.role!.teacher !== 'common'" class="flex gap-4">
                <Dropdown
                  class="flex-1"
                  :class="{ 'p-invalid': isInvalid(i, 'grade') }"
                  v-model="member.grade"
                  placeholder="학년 선택"
                  optionLabel="label"
                  optionValue="value"
                  :options="GRADE_OPTIONS"
                  :disabled="member.isNewFriendClass"
                />

                <Dropdown
                  class="flex-1"
                  :class="{ 'p-invalid': isInvalid(i, 'group') }"
                  v-model="member.group"
                  placeholder="학급 선택"
                  optionLabel="label"
                  optionValue="value"
                  :options="GROUP_OPTIONS"
                  :disabled="member.isNewFriendClass"
                />
              </div>
            </Transition>
          </div>
        </div>

        <div v-else class="flex items-start">
          <div class="flex-1">
            <p class="text-lg font-bold">학급 정보</p>
          </div>

          <div class="flex-2">
            <div class="mb-2 flex items-center justify-between">
              <p>새친구인가요?</p>

              <div class="flex items-center gap-2">
                <p>
                  {{ member.isNewFriendClass ? '네' : '아니요' }}
                </p>
                <InputSwitch v-model="member.isNewFriendClass" />
              </div>
            </div>

            <div class="flex gap-4">
              <Dropdown
                class="flex-1"
                :class="{ 'p-invalid': isInvalid(i, 'grade') }"
                v-model="member.grade"
                placeholder="학년 선택"
                optionLabel="label"
                optionValue="value"
                :options="GRADE_OPTIONS"
              />

              <Dropdown
                class="flex-1"
                :class="{ 'p-invalid': isInvalid(i, 'group') }"
                v-model="member.group"
                placeholder="학급 선택"
                optionLabel="label"
                optionValue="value"
                :options="GROUP_OPTIONS"
                :disabled="member.isNewFriendClass"
              />
            </div>
          </div>
        </div>

        <hr class="my-3 h-1 border-0 bg-slate-200" />

        <div class="flex items-start">
          <div class="flex-1">
            <p class="text-lg font-bold">추가 정보</p>
          </div>

          <div class="flex-2">
            <label class="mb-2 inline-block font-bold" for="registeredAt"> 교육부 첫 출석일 </label>
            <Calendar id="registeredAt" class="w-full" touch-u-i showButtonBar v-model="member.registeredAt" />

            <label class="my-2 inline-block font-bold" for="remark">비고</label>
            <InputText id="remark" class="w-full" v-model="member.remark" />
          </div>
        </div>

        <Button label="삭제하기" class="p-button-danger p-button-sm" @click="handleDelete(i)" />
        <Button label="복사하기" class="p-button-help p-button-sm" @click="handleCopy(i)" />
      </div>
    </section>
  </TheDialog>
</template>

<script setup lang="ts">
import type { Member } from '@/models';
import { GRADE_OPTIONS, GROUP_OPTIONS, TEACHER_ROLE } from '@/constants/common';
import TheDialog from '@/components/TheDialog.vue';

const props = defineProps<{
  v: any;
  visible: boolean;
  members: Omit<Member, 'uid' | 'createdAt'>[];
}>();

const emit = defineEmits(['add', 'copy', 'delete', 'submit', 'close']);

const handleAdd = () => emit('add');

const handleCopy = (i: number) => emit('copy', i);

const handleDelete = (i: number) => emit('delete', i);

const handleClose = (payload: boolean) => {
  if (confirm('작업한 내용이 모두 사라집니다. 정말 닫으시겠습니까?')) {
    emit('close', payload);
  }
};

const handleSubmit = async () => {
  const isFormCorrect = await props.v.$validate();
  if (!isFormCorrect) {
    return;
  }

  emit('submit');
  emit('close');
};

const isInvalid = (i: number, key: string) => {
  const errors = props.v.$errors[0]?.$response?.$errors;

  if (errors && errors[i][key].length > 0) {
    return true;
  }
  return false;
};

// const toggleBirth = (i: number) => {
//   const member = props.members[i];

//   if (member.birthLater) {
//     member.birth = null;
//   } else {
//     const date = new Date();
//     const grade = member.grade ? ~~member.grade + 6 : 9;
//     const year = date.getFullYear() - grade;

//     date.setFullYear(year);
//     date.setMonth(0);
//     date.setDate(1);

//     member.birth = date;
//   }
// };
</script>
