<template>
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex flex-col gap-2">
      <label for="name">{{ church }}에 등록된 이름을 입력해주세요</label>
      <InputText v-model="name" id="name" class="w-full" :class="{ 'p-invalid': v$.name.$error }" />
      <small class="text-red-500"> 오타가 있을 경우 승인이 제한 될 수 있습니다. </small>
    </div>

    <div class="flex justify-between">
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
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';
import { useWaypointStore } from '@/stores/waypoint';

const emit = defineEmits(['prev', 'next']);

const router = useRouter();
const memberStore = useMemberStore();
const { church, department, name } = storeToRefs(useWaypointStore());

if (!church.value || !department.value) {
  router.replace({ name: 'GroupCheck' });
}

const rules = computed(() => ({
  name: { required },
}));

const v$ = useVuelidate(rules, { name });

const index = 1;

const prevPage = () => emit('prev', { index });

const nextPage = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }

  const member = await memberStore.fetchByName({
    church: church.value,
    department: department.value,
    name: name.value,
  });

  if (!member.length) {
    return alert(
      `${name.value} 선생님은 현재 ${church.value} ${department.value}에 등록되어 있지 않아 승인이 불가능합니다. 관리자에게 문의해주시기 바랍니다.`
    );
  }

  emit('next', { index });
};
</script>

<style scoped></style>
