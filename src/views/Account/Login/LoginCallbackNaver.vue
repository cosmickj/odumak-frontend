<template>
  <div class="h-screen flex items-center justify-center">
    <ProgressSpinner stroke-width="3" animation-duration="1.5s" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { getNaverOAuth, getCustomToken } from '@/api/oauth';
import { auth } from '@/firebase/config';
import { signInWithCustomToken } from '@firebase/auth';
import { UserData } from '@/types';

interface NaverOAuth {
  message: string;
  response: {
    email: string;
    id: string;
    name: string;
    nickname: string;
    profile_image: string;
  };
  resultcode: string;
}

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    // #001 콜백 URL 파싱
    const queryList = router.currentRoute.value.hash
      .substring(1)
      .split('&')
      .map((q) => q.split('='));
    const queryObj = Object.fromEntries(queryList);

    // #002 Access Token을 통한 네이버 로그인 정보 조회
    const { data: naverOAuth } = await getNaverOAuth(queryObj['access_token']);
    const {
      //
      id,
      email,
      name,
      profile_image,
    } = (naverOAuth as NaverOAuth).response;

    // #003 파이어베이스 커스텀 토큰 발급 및 로그인
    const { data: customToken } = await getCustomToken(id);
    await signInWithCustomToken(auth, customToken);

    // #004 해당 유저에게 필요한 데이터가 없을 경우 업데이트 진행
    // if (!account.displayName) {
    //   await updateProfile(auth.currentUser, { displayName: name });
    // }
    // if (!account.photoURL) {
    //   await updateProfile(auth.currentUser, { photoURL: profile_image });
    // }
    // if (!account.email) {
    //   await updateEmail(auth.currentUser, email);
    // }

    // #005 오두막 서비스에 필요한 유저 데이터를 저장할 document 생성
    if (!auth.currentUser) {
      return;
    }

    const user = await userStore.fetchSingle({ uid: id });
    if (user === null) {
      const newUser: UserData = {
        uid: id,
        email,
        provider: 'naver' as const,
        profileImage: profile_image,
        name,
        birth: null,
        church: null,
        department: null,
        role: null,
        grade: null,
        group: null,
        phone: '',
        isAccepted: false,
        isRejected: false,
        rejectedReason: '',
      };
      await userStore.createSingle(newUser);
    }

    await userStore.fetchSingle({ uid: id });
    router.push({ name: 'HomeView' });
  } catch (error) {
    throw Error((error as Error).message);
  }
});
</script>
