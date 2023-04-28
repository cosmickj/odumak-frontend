<template>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col">
        <label for="role" class="mb-1">담임 여부</label>
        <SelectButton
          unselectable
          class="flex break-keep"
          :options="TEACHER_ROLE"
          optionLabel="label"
          optionValue="value"
          v-model="formState.role"
        />
      </div>

      <div v-if="formState.role !== 'common'" class="flex flex-col">
        <label for="grade" class="mb-1">담당 학년</label>
        <Dropdown
          v-model="formState.grade"
          :class="{ 'p-invalid': v$.grade.$error }"
          :options="GRADE_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="학년을 선택해주세요"
        />
      </div>

      <div v-if="formState.role !== 'common'" class="flex flex-col">
        <label for="group" class="mb-1">담당 학급</label>
        <Dropdown
          v-model="formState.group"
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
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import { GRADE_OPTIONS, GROUP_OPTIONS, TEACHER_ROLE } from '@/constants/common';

const router = useRouter();

const props = defineProps<{
  formState: any;
}>();

if (!props.formState.church || !props.formState.department) {
  router.push({ name: 'GroupCheck' });
}

const emit = defineEmits(['prevPage', 'nextPage']);

const formState = reactive(Object.assign({}, props.formState));

watch(formState, (newValue) => {
  if (newValue.role === 'common') {
    formState.grade = '';
    formState.group = '';
  }
});

const rules = computed(() => ({
  role: { required },
  grade: {
    requiredIf: requiredIf(formState.role !== 'common'),
  },
  group: {
    requiredIf: requiredIf(formState.role !== 'common'),
  },
}));

const v$ = useVuelidate(rules, formState);

const prevPage = () => {
  emit('prevPage', { index: 2 });
};

const nextPage = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }

  emit('nextPage', { index: 2, formState });
};
</script>

<style scoped>
:deep(.p-selectbutton .p-button.p-component) {
  flex: 1;
}
</style>
