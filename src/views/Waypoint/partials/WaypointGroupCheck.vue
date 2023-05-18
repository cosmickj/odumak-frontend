<template>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col">
        <label for="church" class="mb-1">교회 이름</label>
        <Dropdown
          v-model="church"
          :class="{ 'p-invalid': v$.church.$error }"
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
          :class="{ 'p-invalid': v$.department.$error }"
          :options="DEPARTMENT_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="부서를 선택해주세요"
        />
      </div>
    </div>

    <div class="flex justify-between">
      <Button
        text
        severity="secondary"
        label="홈으로"
        @click="router.push({ name: 'HomeView' })"
      />

      <Button severity="warning" label="다음으로" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useWaypointStore } from '@/store/waypoint';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { CHURCH_OPTIONS, DEPARTMENT_OPTIONS } from '@/constants/common';

const emit = defineEmits(['prevPage', 'nextPage']);

const router = useRouter();
const { church, department } = storeToRefs(useWaypointStore());

const rules = computed(() => ({
  church: { required },
  department: { required },
}));

const v$ = useVuelidate(rules, { church, department });

const nextPage = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }
  emit('nextPage', { index: 0 });
};
</script>
