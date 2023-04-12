<template>
  <section class="flex flex-col px-5 py-8">
    <div class="mb-8">
      <Steps :model="items" aria-label="Form Steps" />
    </div>

    <RouterView
      v-slot="{ Component }"
      :formState="formState"
      @prevPage="prevPage"
      @nextPage="nextPage"
    >
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
    </RouterView>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
  {
    label: '소속 정보',
    to: { name: 'GroupCheck' },
  },
  {
    label: '담임 여부',
    to: { name: 'TeacherCheck' },
  },
  {
    label: '퀴즈 퀴즈',
    to: { name: 'MemberCheck' },
  },
]);

interface FormState {
  church: string;
  department: string;
  role: string;
  grade: string;
  group: string;
}

const formState = reactive<FormState>({
  church: '테스트',
  department: '테스트',
  role: 'main',
  grade: '3',
  group: '1',
});

const prevPage = (payload: { index: number }) => {
  router.push({ name: items.value[payload.index - 1].to.name });
};

const nextPage = (payload: { index: number; formState: FormState }) => {
  for (const key in payload.formState) {
    const _key = key as keyof FormState;
    formState[_key] = payload.formState[_key];
  }

  router.push({ name: items.value[payload.index + 1].to.name });
};
</script>

<style scoped>
:deep(.p-steps .p-steps-item .p-menuitem-link) {
  background: unset;
}
:deep(.p-steps .p-steps-item.p-highlight .p-steps-number) {
  background: #fed7aa;
}
</style>
