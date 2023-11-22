<template>
  <Dialog
    modal
    class="w-[40vw] max-w-[480px]"
    header="수정하기"
    position="right"
    v-model:visible="visibleRef"
    :closable="false"
    :draggable="false"
    :breakpoints="{ '640px': '90vw' }"
  >
    <section class="flex flex-col">
      <div class="flex items-start">
        <div class="flex-1">
          <p class="text-lg font-bold">기본 정보</p>
        </div>

        <div class="flex-2">
          <p class="mb-2 font-bold">이름</p>
          <InputText v-model="member.name" class="w-full" :class="{ 'p-invalid': v.name.$error }" />

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
            :class="{ 'p-invalid': v.birth.$error }"
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
                <p :class="switchState(member.isNewFriendClass)">
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
                :class="{ 'p-invalid': v.grade.$error }"
                v-model="member.grade"
                placeholder="학년 선택"
                optionLabel="label"
                optionValue="value"
                :options="GRADE_OPTIONS"
                :disabled="member.isNewFriendClass"
              />

              <Dropdown
                class="flex-1"
                :class="{ 'p-invalid': v.group.$error }"
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
              <p :class="switchState(member.isNewFriendClass)">
                {{ member.isNewFriendClass ? '네' : '아니요' }}
              </p>
              <InputSwitch v-model="member.isNewFriendClass" />
            </div>
          </div>

          <div class="flex gap-4">
            <Dropdown
              class="flex-1"
              :class="{ 'p-invalid': v.grade.$error }"
              v-model="member.grade"
              placeholder="학년 선택"
              optionLabel="label"
              optionValue="value"
              :options="GRADE_OPTIONS"
            />

            <Dropdown
              class="flex-1"
              :class="{ 'p-invalid': v.group.$error }"
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
    </section>

    <template #footer>
      <Button text label="취소하기" icon="pi pi-times" @click="handleClose" />
      <Button
        label="수정하기"
        severity="warning"
        icon="pi pi-check"
        :disabled="isEditButtonClickable"
        @click="handleEdit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '@/models';
import { GRADE_OPTIONS, GROUP_OPTIONS, TEACHER_ROLE } from '@/constants/common';

const emit = defineEmits(['edit', 'close']);

const props = defineProps<{
  v: any;
  visible: boolean;
  clone: Partial<Member>;
  member: Partial<Member>;
}>();

const visibleRef = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    visibleRef.value = newValue;
  },
});

const handleClose = () => emit('close');

const handleEdit = async () => {
  const isFormCorrect = await props.v.$validate();
  if (!isFormCorrect) {
    return;
  }

  emit('edit', props.member);
  emit('close');
};

const switchState = (flag?: boolean) => {
  return flag ? 'text-[#2196f3]' : 'text-[#ced4da]';
};

const isEditButtonClickable = computed(() => {
  return JSON.stringify(props.member) === JSON.stringify(props.clone);
});
</script>

<style scoped></style>
