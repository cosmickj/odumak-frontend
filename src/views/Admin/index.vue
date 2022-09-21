<template>
  <div class="wrapper">
    <div class="container">
      <div class="p-5 text-center select-none my-12">
        <RouterLink class="text-2xl cursor-pointer" :to="{ name: 'HomeView' }">
          <i class="text-2xl mr-2 pi pi-home"></i>
          홈
        </RouterLink>

        <span class="text-2xl mx-5">|</span>

        <RouterLink
          class="text-2xl cursor-pointer"
          :to="{ name: 'AdminView', params: { position: 'student' } }"
        >
          <i class="text-2xl mr-2 pi pi-user"></i>
          학생 목록
        </RouterLink>

        <span class="text-2xl mx-5">|</span>

        <RouterLink
          class="text-2xl cursor-pointer"
          :to="{ name: 'AdminView', params: { position: 'teacher' } }"
        >
          <i class="text-2xl mr-2 pi pi-pencil"></i>
          교사 목록
        </RouterLink>
      </div>
    </div>

    <div class="container">
      <div class="mb-12">
        <Button
          class="p-button-success mr-2"
          icon="pi pi-plus"
          label="추가하기"
        />
        <Button class="p-button-danger" icon="pi pi-trash" label="삭제하기" />
      </div>
    </div>

    <div class="container">
      <div
        class="overflow-hidden mb-12 border border-slate-300 rounded-2xl drop-shadow-lg"
      >
        <AdminStudent
          v-if="route.params.position === 'student'"
          :data-source="dataSource"
          :is-loading="isLoading"
        />
        <AdminTeacher
          v-else
          :data-source="dataSource"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Admin',
};
</script>

<script setup lang="ts">
import AdminStudent from './components/AdminStudent.vue';
import AdminTeacher from './components/AdminTeacher.vue';
import { useRoute } from 'vue-router';
import { useMemberStore } from '@/store/member';
import { computed, onMounted, ref, watch } from 'vue';

const route = useRoute();
const position = computed(() => route.params.position);

const member = useMemberStore();

const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    if (position.value === 'student' || position.value === 'teacher') {
      dataSource.value = await member.fetchMembers({
        church: '영은교회',
        department: '초등부',
        position: position.value,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getMembers();
});

watch(position, async () => {
  await getMembers();
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}
.router-link-exact-active {
  font-weight: bold;
  color: orange;
}
</style>
