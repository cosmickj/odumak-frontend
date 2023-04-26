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
import { useAccountStore } from '@/store/account';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const accountStore = useAccountStore();

const items = ref([
  {
    label: '이름',
    to: { name: 'NameCheck' },
  },
  {
    label: '소속',
    to: { name: 'GroupCheck' },
  },
  {
    label: '담임 여부',
    to: { name: 'TeacherCheck' },
  },
  {
    label: '퀴즈',
    to: { name: 'MemberCheck' },
  },
]);

interface FormState {
  name: string;
  church: string;
  department: string;
  role: string;
  grade: string;
  group: string;
}

const formState = reactive<FormState>({
  name: accountStore.accountData?.name || '',
  church: accountStore.accountData?.church || '',
  department: accountStore.accountData?.department || '',
  role: accountStore.accountData?.role || 'common',
  grade: accountStore.accountData?.grade || '',
  group: accountStore.accountData?.group || '',
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
