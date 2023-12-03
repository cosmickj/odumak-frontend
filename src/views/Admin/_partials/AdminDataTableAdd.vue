<template>
  <TheDialog :visible="visible" @close="handleClose">
    <template #header>
      <div class="flex gap-2">
        <Button label="인원 추가" severity="warning" @click="handleAdd" />
        <Button label="제출하기" severity="success" @click="handleSubmit" />
      </div>
    </template>

    <section class="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <div v-for="(member, i) in members" class="rounded bg-stone-500 p-4 text-white" :key="i">
        <div>
          <p class="text-lg font-bold">기본 정보</p>

          <p class="mb-2">이름</p>
          <InputText v-model="member.name" class="w-full" :class="{ 'p-invalid': isInvalid(i, 'name') }" />

          <div class="my-2 flex gap-8">
            <p>성별</p>
            <div class="flex items-center gap-2">
              <RadioButton v-model="member.gender" name="gender" value="male" :input-id="`male-${i + 1}`" />
              <label class="cursor-pointer" :for="`male-${i + 1}`">남자</label>

              <RadioButton v-model="member.gender" name="gender" value="female" :input-id="`female-${i + 1}`" />
              <label class="cursor-pointer" :for="`female-${i + 1}`">여자</label>
            </div>
          </div>

          <div class="flex gap-8">
            <p class="mb-2">생년월일</p>
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
            <Checkbox binary :input-id="`birth-later-${i + 1}`" v-model="member.birthLater" />
            <label class="ml-2 cursor-pointer select-none" :for="`birth-later-${i + 1}`">
              나중에 입력할게요
            </label>
          </div>
        </div>

        <hr class="my-4 h-[1px] bg-slate-200" />

        <div v-if="member.job === 'teacher'">
          <p class="text-lg font-bold">담임 정보</p>

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
                placeholder="학년"
                optionLabel="label"
                optionValue="value"
                :options="GRADE_OPTIONS"
                :disabled="member.isNewFriendClass"
              />

              <Dropdown
                class="flex-1"
                :class="{ 'p-invalid': isInvalid(i, 'group') }"
                v-model="member.group"
                placeholder="학급"
                optionLabel="label"
                optionValue="value"
                :options="GROUP_OPTIONS"
                :disabled="member.isNewFriendClass"
              />
            </div>
          </Transition>
        </div>

        <div v-else class="">
          <p class="text-lg font-bold">학급 정보</p>

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
              :class="{ 'p-invalid': isInvalid(i, 'grade') }"
              class="w-full"
              v-model="member.grade"
              placeholder="학년"
              optionLabel="label"
              optionValue="value"
              :options="GRADE_OPTIONS"
            />

            <Dropdown
              :class="{ 'p-invalid': isInvalid(i, 'group') }"
              class="w-full"
              v-model="member.group"
              placeholder="학급"
              optionLabel="label"
              optionValue="value"
              :options="GROUP_OPTIONS"
              :disabled="member.isNewFriendClass"
            />
          </div>
        </div>

        <hr class="my-4 h-[1px] bg-slate-200" />

        <p class="text-lg font-bold">추가 정보</p>

        <label class="mb-2 inline-block" for="registeredAt"> 교육부 첫 출석일 </label>
        <Calendar id="registeredAt" class="w-full" touch-u-i showButtonBar v-model="member.registeredAt" />

        <label class="my-2 inline-block" for="remark">비고</label>
        <InputText id="remark" class="w-full" v-model="member.remark" />

        <div class="mt-4 flex items-end justify-between">
          <div class="flex gap-2">
            <Button label="삭제하기" severity="danger" @click="handleDelete(i)" />
            <Button label="복사하기" severity="help" @click="handleCopy(i)" />
          </div>

          <p class="text-lg">
            <span>{{ i + 1 }}</span>
            /
            <span>{{ members.length }}</span>
          </p>
        </div>
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
