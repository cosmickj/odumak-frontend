<template>
  <div class="flex-1 flex flex-col justify-between">
    <div>
      <div class="text-lg">
        <p v-if="formState.role !== 'common'">
          <span class="text-orange-400">
            {{ formState.church }} {{ formState.department }}
            {{ formState.grade }}학년 {{ formState.group }}반
          </span>
          <span>
            담당 확인을 위해 아래 이름 중 담당 학생을 모두 선택 후 제출하기를
            눌러주세요
          </span>
        </p>

        <p v-else>
          <span class="text-orange-400">
            {{ formState.church }} {{ formState.department }}
          </span>
          <span>
            소속 확인을 위해 아래 이름 중 같은 소속 선생님을 모두 선택 후
            제출하기를 눌러주세요
          </span>
        </p>
      </div>

      <div class="grid grid-cols-3 gap-3 py-4">
        <div
          v-for="(candidate, i) in candidates"
          ref="toggleButtonRefs"
          :key="i"
        >
          <ToggleButton
            class="flex aspect-square bg-white rounded-md text-xs xs:text-base items-center justify-center shadow"
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
import { getCurrentUser } from '@/router';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { useUserStore } from '@/store/user';
import { faker } from '@faker-js/faker/locale/ko';
import type { MemberData } from '@/types';
import type { User } from 'firebase/auth';

const router = useRouter();
const accountStore = useAccountStore();
const memberStore = useMemberStore();
const userStore = useUserStore();

const props = defineProps<{
  formState: any;
}>();

if (!props.formState.church || !props.formState.department) {
  router.push({ name: 'GroupCheck' });
}

const emit = defineEmits(['prevPage']);

const members = ref<MemberData[]>([]);

onActivated(async () => {
  try {
    const { church, department, grade, group } = props.formState;

    if (props.formState.role === 'common') {
      members.value = await memberStore.fetchAll({
        church,
        department,
        job: 'teacher',
      });
    } else {
      members.value = await memberStore.fetchByGradeGroup({
        church,
        department,
        grade,
        group,
      });
    }

    candidates.value = shuffle(getCandidates(members.value));
  } catch (error) {
    console.log(error);
  }
});

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

const toggleButtonRefs = ref<HTMLDivElement[]>([]);

const complete = async () => {
  try {
    const isCorrect = candidates.value.every((candidate) => {
      return candidate.checked === candidate.answer;
    });

    if (!isCorrect) {
      toggleButtonRefs.value.forEach((ele) => {
        ele.classList.add('wrong');
      });

      setTimeout(() => {
        toggleButtonRefs.value.forEach((ele) => {
          ele.classList.remove('wrong');
        });
      }, 900);
    } else {
      await userStore.modifyMultiple({
        uid: accountStore.accountData?.uid,
        isAccepted: true,
        ...props.formState,
      });

      alert('인증되었습니다! 감사합니다!');

      const currentUser = (await getCurrentUser()) as User;
      if (currentUser) {
        const userStore = useUserStore();
        const userData = await userStore.fetchSingle({
          uid: currentUser.uid,
        });

        if (userData) {
          accountStore.accountData = {
            ...userData,
            uid: currentUser.uid,
            email: currentUser.email!,
            name: currentUser.displayName!,
          };
        }
      }
      router.push({ name: 'HomeView' });
    }
  } catch (error) {
    console.log(error);
  }
};

const prevPage = () => {
  emit('prevPage', { index: 2 });
};
</script>

<style scoped>
.wrong {
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
