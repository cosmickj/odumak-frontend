<template>
  <section class="overflow-auto flex-auto">
    <AdminStudent
      v-if="memberPosition === 'student'"
      :data-source="dataSource"
      :is-loading="isLoading"
    />

    <AdminTeacher
      v-else-if="memberPosition === 'teacher'"
      :data-source="dataSource"
      :is-loading="isLoading"
    />

    <AdminAdd
      :is-opened="isOpened"
      :member-position="'student'"
      @open="openModal"
      @close="closeModal"
      @submit="addMember"
    />
  </section>
</template>

<script setup lang="ts">
import AdminAdd from './components/AdminAdd.vue';
import AdminStudent from './components/AdminStudent.vue';
import AdminTeacher from './components/AdminTeacher.vue';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';

import type { AddStudentParams, MemberPosition } from '@/types';

const route = useRoute();

const member = useMemberStore();
const account = useAccountStore();

const dataSource = ref();
const userChurch = computed(() => account.userData?.church);
const userDepartment = computed(() => account.userData?.department);
const memberPosition = computed(() => route.params.position as MemberPosition);

const isLoading = ref(true);

onMounted(async () => {
  try {
    dataSource.value = await member.fetchMembers({
      church: userChurch.value,
      department: userDepartment.value,
      position: memberPosition.value,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});

const isOpened = ref(false);

const openModal = () => {
  isOpened.value = true;
};
const closeModal = () => {
  const message =
    '지금까지 작성한 내용이 모두 사라집니다.\n정말 닫으시겠습니까?';
  if (confirm(message)) {
    isOpened.value = false;
  }
};

const addMember = async (payload: AddStudentParams) => {
  try {
    await member.createMember({
      church: userChurch.value!,
      department: userDepartment.value!,
      position: memberPosition.value,
      ...payload,
    });

    dataSource.value = await member.fetchMembers({
      church: userChurch.value,
      department: userDepartment.value,
      position: memberPosition.value,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isOpened.value = false;
  }
};
</script>
