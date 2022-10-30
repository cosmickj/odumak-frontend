<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

onMounted(async () => {
  try {
    const queryList = router.currentRoute.value.hash
      .substring(1)
      .split('&')
      .map((q) => {
        return q.split('=');
      });

    const obj = Object.fromEntries(queryList);
    const { data: naverOAuth } = await getNaverOAuth(obj['access_token']);
    const {
      // 네이버 로그인 제공 정보
      email,
      id,
      name,
      profile_image,
    } = (naverOAuth as NaverOAuth).response;

    const { data: customToken } = await getCustomToken(id);
    const { user } = await signInWithCustomToken(auth, customToken);

    if (!auth.currentUser) return;
    if (!user.displayName) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    if (!user.photoURL) {
      await updateProfile(auth.currentUser, { photoURL: profile_image });
    }
    if (!user.email) {
      await updateEmail(auth.currentUser, email);
    }

    router.push({ name: 'HomeView' });
  } catch (error) {
    console.log(error);
  }
});
</script>
