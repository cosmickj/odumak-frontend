<template>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex flex-col">
      <label for="name" class="mb-1">이름을 정확히 입력해주세요</label>
      <InputText
        v-model="formState.name"
        id="name"
        class="w-full"
        :class="{ 'p-invalid': v$.name.$error }"
      />
      <small class="mt-1">오타가 있을 경우 승인이 제한 될 수 있습니다</small>
    </div>

    <div class="flex justify-between">
      <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button severity="warning" label="다음으로" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/store/member';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const router = useRouter();
const memberStore = useMemberStore();

const props = defineProps<{
  formState: any;
}>();

const emit = defineEmits(['prevPage', 'nextPage']);

if (!props.formState.church || !props.formState.department) {
  router.push({ name: 'GroupCheck' });
}

const formState = reactive(Object.assign({}, props.formState));

const rules = computed(() => ({
  name: { required },
}));

const v$ = useVuelidate(rules, formState);

const prevPage = () => {
  emit('prevPage', { index: 1 });
};

const nextPage = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }

  const member = await memberStore.fetchByName({
    church: formState.church,
    department: formState.department,
    name: formState.name,
  });

  if (!member.length) {
    alert(
      `${formState.name} 선생님은 현재 ${formState.department} ${formState.church}에 등록되어 있지 않아 승인이 불가능합니다. 관리자에게 문의해주시기 바랍니다.`
    );
  } else {
    emit('nextPage', { index: 1, formState });
  }
};
</script>

<style scoped></style>
