<template>
  <div class="flex-1 flex flex-col justify-between">
    <div>
      <div class="break-keep text-xl">
        <p class="mr-1 text-orange-400">
          {{ formState.church }} {{ formState.department }}
          {{ teacher?.name }} 선생님
        </p>
        <p>확인을 위해 담당 학생을 모두 선택 후 제출하기를 눌러주세요</p>
      </div>

      <div class="grid grid-cols-3 gap-3 py-4">
        <div
          v-for="(candidate, i) in candidates"
          ref="toggleButtonRefs"
          :key="i"
        >
          <ToggleButton
            class="flex aspect-square bg-white rounded-md items-center justify-center shadow"
            v-model="candidate.checked"
            :on-label="candidate.name"
            :off-label="candidate.name"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button severity="success" label="제출하기" @click="complete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { useUserStore } from '@/store/user';
import { faker } from '@faker-js/faker/locale/ko';
import type { MemberData } from '@/types';

const props = defineProps<{
  formState: any;
}>();

const emit = defineEmits(['prevPage']);

const router = useRouter();
const accountStore = useAccountStore();
const memberStore = useMemberStore();
const userStore = useUserStore();

const teacher = ref<MemberData>();
const students = ref<MemberData[]>([]);

class Candidate {
  constructor(
    public name: string,
    public checked: boolean,
    public answer: boolean
  ) {}
}

const candidates = ref<Candidate[]>([]);

const getCandidates = (students: any[]) => {
  const candidates = [];

  for (let i = 0; i < 9; i++) {
    if (!students.length || i > 2) {
      const fakeName = faker.name.lastName() + faker.name.firstName();
      candidates.push(new Candidate(fakeName, false, false));
    } else {
      const student = students.pop();
      candidates.push(new Candidate(student.name, false, true));
    }
  }
  return candidates;
};

const shuffle = (array: Candidate[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

onActivated(async () => {
  try {
    const { church, department, grade, group } = props.formState;

    const members = await memberStore.fetchByGradeGroup({
      church,
      department,
      grade,
      group,
    });

    members.forEach((member) => {
      if (member.job === 'teacher') {
        teacher.value = member;
      } else if (member.job === 'student') {
        students.value.push(member);
      }
    });

    candidates.value = shuffle(getCandidates(students.value));
  } catch (error) {
    console.log(error);
  }
});

const toggleButtonRefs = ref<HTMLDivElement[]>([]);

const complete = async () => {
  const isCorrect = candidates.value.every((candidate) => {
    return candidate.checked === candidate.answer;
  });

  if (!isCorrect) {
    toggleButtonRefs.value.forEach((ele) => {
      ele.classList.add('wrong-answer');
    });

    setTimeout(() => {
      toggleButtonRefs.value.forEach((ele) => {
        ele.classList.remove('wrong-answer');
      });
    }, 900);
  } else {
    await userStore.modifyMultiple({
      uid: accountStore.accountData?.uid,
      ...props.formState,
    });

    alert('인증되었습니다! 감사합니다!');
    router.push({ name: 'HomeView' });
  }
};

const prevPage = () => {
  emit('prevPage', { index: 2 });
};
</script>

<style scoped>
.wrong-answer {
  animation: shake 0.3s 3;
  border-radius: 6px;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
}

@keyframes shake {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-5px, -5px);
  }
  50% {
    transform: translate(5px, 5px);
  }
  75% {
    transform: translate(-5px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
