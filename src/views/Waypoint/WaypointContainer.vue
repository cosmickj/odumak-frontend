<template>
  <section class="flex flex-col px-5 py-8">
    <div class="mb-8">
      <Steps :model="steps" aria-label="Form Steps" />
    </div>

    <RouterView v-slot="{ Component }" @prev="toPrevPage" @next="toNextPage">
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
    </RouterView>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useWaypointStore } from '@/stores/waypoint';

const router = useRouter();
const userStore = useUserStore();
const waypointStore = useWaypointStore();

const steps = ref([
  {
    label: '소속',
    to: { name: 'GroupCheck' },
  },
  {
    label: '이름',
    to: { name: 'NameCheck' },
  },
  {
    label: '담임 여부',
    to: { name: 'TeacherCheck' },
  },
  {
    label: '공동체',
    to: { name: 'MemberCheck' },
  },
]);

waypointStore.$patch({
  // church: '',
  // department: '',
  church: '테스트',
  department: '테스트',
  name: userStore.userData?.name,
  role: userStore.userData?.role,
  grade: userStore.userData?.grade,
  group: userStore.userData?.group,
});

const toPrevPage = ({ index }: { index: number }) => {
  if (index - 1 < 0) {
    return router.push({ name: 'HomeView' });
  }
  return router.push({ name: steps.value[index - 1].to.name });
};

const toNextPage = ({ index }: { index: number }) => {
  router.push({ name: steps.value[index + 1].to.name });
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
