<template>
  <div>Loading...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { getNaverOAuth, getCustomToken } from '@/api/oauth';
import { auth } from '@/firebase/config';
import {
  signInWithCustomToken,
  updateEmail,
  updateProfile,
} from '@firebase/auth';

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
const accountStore = useAccountStore();

onMounted(async () => {
  try {
    // #001 콜백 URL 파싱
    const queryList = router.currentRoute.value.hash
      .substring(1)
      .split('&')
      .map((q) => {
        return q.split('=');
      });
    const obj = Object.fromEntries(queryList);

    // #002 Access Token을 통한 네이버 로그인 정보 조회
    const { data: naverOAuth } = await getNaverOAuth(obj['access_token']);
    const {
      // 네이버 로그인 제공 정보
      email,
      id,
      name,
      profile_image,
    } = (naverOAuth as NaverOAuth).response;

    // #003 파이어베이스 커스텀 토큰 발급 및 로그인
    const { data: customToken } = await getCustomToken(id);
    const { user } = await signInWithCustomToken(auth, customToken);

    // #004 해당 유저에게 필요한 데이터가 없을 경우 업데이트 진행
    if (!auth.currentUser) {
      return;
    }
    if (!user.displayName) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    if (!user.photoURL) {
      await updateProfile(auth.currentUser, { photoURL: profile_image });
    }
    if (!user.email) {
      await updateEmail(auth.currentUser, email);
    }

    // #005 오두막 서비스에 필요한 유저 데이터를 저장할 document 생성
    const hasDoc = await accountStore.fetchAccount({ uid: id });
    if (!hasDoc) {
      await accountStore.createUser({
        uid: id,
        church: '',
        department: '',
        role: '',
        grade: '',
        group: '',
      });
    }

    router.push({ name: 'HomeView' });
  } catch (error) {
    console.log(error);
  }
});
</script>
