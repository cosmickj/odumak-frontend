<template>
  <div class="flex flex-1 flex-col justify-between">
    <div>
      <div class="text-lg">
        <p v-if="role.teacher === 'common'">
          아래 이름 중
          <span class="text-orange-400"> {{ church }} {{ department }} </span>
          공동체를 모두 선택 후 제출하기를 눌러주세요. (최대 3명)
        </p>

        <p v-else>
          아래 이름 중
          <span class="text-orange-400"> {{ church }} {{ department }} {{ grade }}학년 {{ group }}반 </span>
          어린이를 모두 선택 후 제출하기를 눌러주세요. (최대 3명)
        </p>
      </div>

      <div class="grid grid-cols-3 gap-3 py-4">
        <template v-if="!candidates.length">
          <Skeleton v-for="i in 9" class="aspect-square" style="height: unset" :key="i" />
        </template>

        <template v-else>
          <div v-for="(candidate, i) in candidates" ref="toggleButtonRefs" :key="i">
            <ToggleButton
              class="flex aspect-square items-center justify-center rounded-md text-xs shadow xs:text-base"
              v-model="candidate.checked"
              :on-label="candidate.name"
              :off-label="candidate.name"
            />
          </div>
        </template>
      </div>
    </div>

    <div class="flex justify-between">
      <Button
        raised
        rounded
        outlined
        severity="secondary"
        icon="pi pi-chevron-left"
        label="이전으로"
        @click="prevPage"
      />

      <Button
        raised
        rounded
        severity="warning"
        icon="pi pi-chevron-right"
        iconPos="right"
        label="제출하기"
        @click="complete"
      />

      <!-- <Button text severity="secondary" label="이전으로" @click="prevPage" />
      <Button
        :disabled="candidates.length === 0"
        severity="success"
        label="제출하기"
        @click="complete"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@faker-js/faker/locale/ko';
import { storeToRefs } from 'pinia';
import { onActivated, onDeactivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Member } from '@/models';
import { useMemberStore } from '@/stores/member';
import { useUserStore } from '@/stores/user';
import { useWaypointStore } from '@/stores/waypoint';
import { getCurrentUser } from '@/router';

const router = useRouter();
const userStore = useUserStore();
const memberStore = useMemberStore();
const {
  //
  church,
  department,
  grade,
  group,
  name,
  role,
} = storeToRefs(useWaypointStore());

if (!church.value || !department.value) {
  router.push({ name: 'GroupCheck' });
}

const emit = defineEmits(['prev']);

const members = ref<Member[]>([]);

class Candidate {
  constructor(
    public name: string,
    public checked: boolean,
    public answer: boolean
  ) {}
}

const candidates = ref<Candidate[]>([]);

const getCandidates = (members: Member[]) => {
  const candidates = [];

  for (let i = 0; i < 9; i++) {
    if (!members.length || i > 2) {
      const fakeName = faker.name.lastName() + faker.name.firstName();
      candidates.push(new Candidate(fakeName, false, false));
    } else {
      const index = Math.floor(Math.random() * members.length);
      const member = members.splice(index, 1);
      candidates.push(new Candidate(member[0].name, false, true));
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
    if (role.value.teacher === 'common') {
      members.value = await memberStore.fetchAll({
        church: church.value,
        department: department.value,
        job: 'teacher',
      });
    } else {
      members.value = await memberStore.fetchByGradeGroup({
        church: church.value,
        department: department.value,
        grade: grade.value,
        group: group.value,
        job: 'student',
      });
    }

    candidates.value = shuffle(getCandidates(members.value));
  } catch (error) {
    console.log(error);
  }
});

onDeactivated(() => {
  candidates.value = [];
});

const index = 3;

const prevPage = () => emit('prev', { index });

const toggleButtonRefs = ref<HTMLDivElement[]>([]);

const complete = async () => {
  try {
    if (candidates.value.length === 0) {
      return;
    }

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
      }, 800);
    }
    //
    else {
      const uid = userStore.userData?.uid;
      if (!uid) {
        alert('잘못된 접근입니다.');
        return router.push({ name: 'HomeView' });
      }
      await userStore.modifyMultiple({
        uid,
        name: name.value,
        church: church.value,
        department: department.value,
        isAccepted: true,
      });
      await userStore.fetchSingle({ uid });

      alert('인증되었습니다! 감사합니다!');
      router.push({ name: 'HomeView' });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.wrong {
  animation: shake 0.3s 3;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
  border-radius: 6px;
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
