<template>
  <div class="flex-1 flex flex-col justify-between">
    <div>
      <p class="break-keep">
        <span class="mr-1">{{ formState.church }}</span>
        <span class="mr-1">{{ formState.department }}</span>
        <span>{{ teacher?.name }} 선생님이</span>
        맞으시다면 담당 학생을 모두 선택 후 제출하기를 눌러주세요
      </p>

      <pre>
        {{ dummy }}
      </pre>

      <!-- <div class="grid grid-cols-3 gap-3 p-4">
        <ToggleButton
          v-for="(item, i) in items"
          class="flex aspect-square bg-white rounded-md items-center justify-center shadow"
          v-model="item.checked"
          :on-label="item.name"
          :off-label="item.name"
          :key="i"
        />
      </div> -->
    </div>

    <div class="flex justify-between">
      <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button severity="success" label="제출하기" @click="nextPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { useMemberStore } from '@/store/member';
import { faker } from '@faker-js/faker/locale/ko';

const props = defineProps<{
  formState: any;
}>();

const emit = defineEmits(['prevPage', 'nextPage']);

const memberStore = useMemberStore();

const items = ref([
  { name: 'aaa', checked: false },
  { name: 'bbb', checked: false },
  { name: 'cccc', checked: false },
  { name: 'ddd', checked: false },
  { name: 'eee', checked: false },
  { name: 'fff', checked: false },
  { name: 'ggg', checked: false },
  { name: 'hhh', checked: false },
  { name: 'iii', checked: false },
]);

const teacher = ref();
const students = ref<any[]>([]);

const dummy = ref<any[]>([]);

onActivated(async () => {
  try {
    const members = await memberStore.fetchByGradeGroup({
      church: props.formState.church,
      department: props.formState.department,
      grade: props.formState.grade,
      group: props.formState.group,
    });

    teacher.value = members.find((mem) => mem.job === 'teacher');
    students.value = members.filter((mem) => mem.job === 'student');

    for (let i = 0; i < 9; i++) {
      if (i > 2) {
        dummy.value.push(`${faker.name.lastName()}${faker.name.firstName()}`);
      } else {
        const student = students.value.pop();
        dummy.value.push(student.name);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

const prevPage = () => {
  emit('prevPage', { index: 2 });
};

const nextPage = async () => {
  emit('nextPage', { index: 2 });
};
</script>

<style scoped></style>
