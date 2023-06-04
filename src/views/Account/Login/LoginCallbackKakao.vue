<template>
  <div class="h-screen flex items-center justify-center">
    <ProgressSpinner stroke-width="3" animation-duration="1.5s" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { getKakaoToken, getCustomToken } from '@/api/oauth';
import { auth } from '@/firebase/config';
import { signInWithCustomToken } from 'firebase/auth';
import { UserData } from '@/types';
import { SHA1 } from 'crypto-js';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const code = router.currentRoute.value.query.code as string;
    const { data } = await getKakaoToken(code);

    const kakaoToken = data.access_token;

    await window.Kakao.Auth.setAccessToken(kakaoToken);

    const statusInfo = await window.Kakao.Auth.getStatusInfo();
    const uid = SHA1(`${statusInfo.user.id}`).toString();

    const { data: customToken } = await getCustomToken(uid);
    await signInWithCustomToken(auth, customToken);

    if (!auth.currentUser) {
      return;
    }

    const user = await userStore.fetchSingle({ uid });
    if (user === null) {
      const newUser: UserData = {
        uid,
        email: statusInfo.user.kakao_account.email || '',
        provider: 'kakao' as const,
        profileImage:
          statusInfo.user.kakao_account.profile.thumbnail_image_url || '',
        name: statusInfo.user.kakao_account.profile.nickname || '',
        birth: null,
        church: null,
        department: null,
        grade: null,
        group: null,
        role: null,
        isAccepted: false,
        isRejected: false,
        rejectedReason: '',
      };
      await userStore.createSingle(newUser);
    }
    await userStore.fetchSingle({ uid });
    router.push({ name: 'HomeView' });
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped></style>
