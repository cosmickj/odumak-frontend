<template>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-2">
      <label for="name">이름을 정확히 입력해주세요</label>
      <InputText
        v-model="name"
        id="name"
        class="w-full"
        :class="{ 'p-invalid': v$.name.$error }"
      />
      <small class="text-red-500">
        오타가 있을 경우 승인이 제한 될 수 있습니다.
      </small>
    </div>

    <div class="flex justify-between">
      <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button severity="warning" label="다음으로" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useMemberStore } from '@/store/member';
import { useWaypointStore } from '@/store/waypoint';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const emit = defineEmits(['prevPage', 'nextPage']);

const router = useRouter();
const memberStore = useMemberStore();
const { church, department, name } = storeToRefs(useWaypointStore());

if (!church.value || !department.value) {
  router.push({ name: 'GroupCheck' });
}

const rules = computed(() => ({
  name: { required },
}));

const v$ = useVuelidate(rules, { name });

const prevPage = () => {
  emit('prevPage', { index: 1 });
};

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
    alert(
      `${name} 선생님은 현재 ${church} ${department}에 등록되어 있지 않아 승인이 불가능합니다. 관리자에게 문의해주시기 바랍니다.`
    );
  } else {
    emit('nextPage', { index: 1 });
  }
};
</script>

<style scoped></style>
