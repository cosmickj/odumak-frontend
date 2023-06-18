<template>
  <section class="flex flex-col px-5 py-8">
    <div class="mb-8">
      <Steps :model="steps" aria-label="Form Steps" />
    </div>

    <RouterView
      v-slot="{ Component }"
      @prevPage="onPrevPage"
      @nextPage="onNextPage"
    >
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
    </RouterView>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useWaypointStore } from '@/store/waypoint';

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
  name: userStore.userData?.name || '',
  church: userStore.userData?.church || '',
  department: userStore.userData?.department || '',
  role: userStore.userData?.role || { system: 'user', teacher: 'common' },
  grade: userStore.userData?.grade || '',
  group: userStore.userData?.group || '',
});

const onPrevPage = ({ index }: { index: number }) => {
  router.push({ name: steps.value[index - 1].to.name });
};

const onNextPage = ({ index }: { index: number }) => {
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
