<template>
  <section class="overflow-auto max-h-[90vh]">
    <div class="text-3xl">총 {{ dataSourceLength }}명</div>

    <AdminStudent
      v-if="memberPosition === 'student'"
      :data-source="dataSource"
      :is-loading="isLoading"
      @row-click="setParams"
    />

    <AdminTeacher
      v-else-if="memberPosition === 'teacher'"
      :data-source="dataSource"
      :is-loading="isLoading"
      @row-click="setParams"
    />

    <AdminAdd
      :is-opened="isOpened"
      :member-position="memberPosition"
      :params="params"
      @open="openModal"
      @close="closeModal"
      @create="addMember"
      @edit="editMember"
      @delete="deleteMember"
    />
  </section>
</template>

<script setup lang="ts">
import AdminAdd from './components/AdminAdd.vue';
import AdminStudent from './components/AdminStudent.vue';
import AdminTeacher from './components/AdminTeacher.vue';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';

import type {
  AddStudentParams,
  AddTeacherParams,
  MemberPosition,
} from '@/types';

const route = useRoute();

const member = useMemberStore();
const account = useAccountStore();

const dataSource = ref();
const dataSourceLength = computed(() => dataSource.value?.length || 0);
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

watch(memberPosition, async () => {
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
    params.value = undefined;
  }
};

const params = ref();

const setParams = (payload: any) => {
  params.value = payload;
  isOpened.value = true;
};

const addMember = async (payload: any) => {
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

/**
 * TODO
 * - 현재 payload와 params가 섞여있어서 굉장히 데이터 흐름을 추적하기 힘들다.
 */
const editMember = async (payload: any) => {
  await member.modifyMember({
    church: userChurch.value,
    department: userDepartment.value,
    position: memberPosition.value,
    ...payload,
  });

  dataSource.value = await member.fetchMembers({
    church: userChurch.value,
    department: userDepartment.value,
    position: memberPosition.value,
  });

  params.value = undefined;
  isOpened.value = false;
};

const deleteMember = async (payload: any) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await member.removeMember({
      church: userChurch.value,
      department: userDepartment.value,
      position: memberPosition.value,
      ...payload,
    });

    dataSource.value = await member.fetchMembers({
      church: userChurch.value,
      department: userDepartment.value,
      position: memberPosition.value,
    });

    params.value = undefined;
    isOpened.value = false;
  }
};
</script>
