<template>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col">
        <label for="role" class="mb-1">담임 여부</label>
        <SelectButton
          unselectable
          v-model="role.teacher"
          class="flex"
          optionLabel="label"
          optionValue="value"
          :options="TEACHER_ROLE"
        />
      </div>

      <div v-if="role.teacher !== 'common'">
        <p class="mb-1">새친구 학급이신가요?</p>

        <div
          class="flex gap-4 p-2 bg-white border border-[#ced4da] rounded-[3px] items-center"
        >
          <InputSwitch v-model="isNewFriendClassTeacher" />
          <p v-if="isNewFriendClassTeacher" class="text-[#2196f3]">맞아요</p>
          <p v-else class="text-[#ced4da]">아니요</p>
        </div>
      </div>

      <div
        v-if="role.teacher !== 'common' && !isNewFriendClassTeacher"
        class="flex flex-col"
      >
        <p class="mb-1">담당 학년</p>
        <Dropdown
          v-model="grade"
          :class="{ 'p-invalid': v$.grade.$error }"
          :options="GRADE_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="학년을 선택해주세요"
        />
      </div>

      <div
        v-if="role.teacher !== 'common' && !isNewFriendClassTeacher"
        class="flex flex-col"
      >
        <p class="mb-1">담당 학급</p>
        <Dropdown
          v-model="group"
          :class="{ 'p-invalid': v$.group.$error }"
          :options="GROUP_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="학급을 선택해주세요"
        />
      </div>
    </div>

    <div class="flex justify-between">
      <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button severity="warning" label="다음으로" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/store/member';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import { GRADE_OPTIONS, GROUP_OPTIONS, TEACHER_ROLE } from '@/constants/common';
import { storeToRefs } from 'pinia';
import { useWaypointStore } from '@/store/waypoint';

const emit = defineEmits(['prevPage', 'nextPage']);

const router = useRouter();
const memberStore = useMemberStore();
const {
  //
  church,
  department,
  grade,
  group,
  name,
  role,
} = storeToRefs(useWaypointStore());

if (!church.value || !department.value || !name.value) {
  router.push({ name: 'GroupCheck' });
}

watch(
  role,
  (newValue) => {
    if (newValue.teacher === 'common') {
      grade.value = '';
      group.value = '';
    }
  },
  { deep: true }
);

const isNewFriendClassTeacher = ref(false);

watch(isNewFriendClassTeacher, (newValue) => {
  if (newValue) {
    grade.value = '0';
    group.value = '0';
  } else {
    grade.value = '';
    group.value = '';
  }
});

const rules = computed(() => ({
  role: { required },
  grade: {
    requiredIf: requiredIf(role.value.teacher !== 'common'),
  },
  group: {
    requiredIf: requiredIf(role.value.teacher !== 'common'),
  },
}));

const v$ = useVuelidate(rules, { role, grade, group });

const prevPage = () => {
  emit('prevPage', { index: 2 });
};

const nextPage = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }

  const [member] = await memberStore.fetchByName({
    church: church.value,
    department: department.value,
    name: name.value,
  });

  if (!member) {
    return alert('잘못된 접근입니다.');
  }

  if (
    member.grade !== grade.value ||
    member.group !== group.value ||
    member.role.teacher !== role.value.teacher
  ) {
    const message = `현재 ${church.value} ${department.value}에 등록되어 있는 정보와 입력하신 정보가 일치하지 않아 승인이 불가능합니다. 관리자에게 문의해주시기 바랍니다.`;
    return alert(message);
  }

  emit('nextPage', { index: 2 });
};
</script>

<style scoped>
:deep(.p-selectbutton .p-button.p-component) {
  flex: 1;
}
@media (max-width: 320px) {
  :deep(.p-selectbutton .p-button.p-component) {
    font-size: 12px;
  }
}
</style>
