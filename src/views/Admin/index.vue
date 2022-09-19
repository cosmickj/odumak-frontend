<template>
  <div class="wrapper">
    <div class="container">
      <div class="p-5 text-center select-none my-12">
        <RouterLink
          class="text-2xl cursor-pointer after:content-['|'] after:mx-5"
          :to="{ name: 'HomeView' }"
        >
          <i class="text-2xl mr-2 pi pi-home"></i>
          홈
        </RouterLink>

        <RouterLink
          class="text-2xl cursor-pointer after:content-['|'] after:mx-5"
          :to="{ name: 'AdminView', params: { position: 'student' } }"
        >
          <i class="text-2xl mr-2 pi pi-user"></i>
          학생 목록
        </RouterLink>

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

    <div class="container h-full overflow-auto">
      <AdminStudent
        v-if="route.params.position === 'student'"
        :data-source="dataSource"
        :is-loading="isLoading"
      />
      <AdminTeacher v-else :data-source="dataSource" :is-loading="isLoading" />
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

const member = useMemberStore();

const position = computed(() => {
  return route.params.position;
});
const dataSource = ref();
const isLoading = ref(false);

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
/* .wrapper {
  border: 2px solid red;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  gap: 24px;
} */
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  /* background-color: orange; */
}
.router-link-exact-active {
  color: orange;
}
</style>
