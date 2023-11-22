<template>
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col">
        <label for="church" class="mb-1">교회 이름</label>
        <Dropdown
          v-model="church"
          :class="{ 'p-invalid': $v.church.$error }"
          :options="CHURCH_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="교회를 선택해주세요"
        />
      </div>

      <div class="flex flex-col">
        <label for="department" class="mb-1">봉사 부서</label>
        <Dropdown
          v-model="department"
          :class="{ 'p-invalid': $v.department.$error }"
          :options="DEPARTMENT_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="부서를 선택해주세요"
        />
      </div>
    </div>

    <div class="flex justify-between gap-2">
      <Button
        raised
        rounded
        outlined
        severity="secondary"
        icon="pi pi-chevron-left"
        label="이전으로"
        @click="prevPage"
      />

      <Button raised rounded icon="pi pi-chevron-right" iconPos="right" label="다음으로" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useWaypointStore } from '@/store/waypoint';
import { CHURCH_OPTIONS, DEPARTMENT_OPTIONS } from '@/constants/common';

const emit = defineEmits(['prev', 'next']);

const { church, department } = storeToRefs(useWaypointStore());

const rules = computed(() => ({
  church: { required },
  department: { required },
}));

const $v = useVuelidate(rules, { church, department });

const index = 0;

const prevPage = () => emit('prev', { index });

const nextPage = async () => {
  const isFormCorrect = await $v.value.$validate();
  if (!isFormCorrect) {
    return;
  }
  emit('next', { index });
};
</script>
