<template>
  <div class="h-screen flex items-center justify-center">
    <ProgressSpinner stroke-width="3" animation-duration="1.5s" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useUserStore } from '@/store/user';
import { getCustomToken, getKakaoToken } from '@/api/oauth';
import { SHA1 } from 'crypto-js';
import {
  signInWithCustomToken,
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { UserData } from '@/types';

const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const code = router.currentRoute.value.query.code as string;
    const { data } = await getKakaoToken(code);

    const token = data.access_token;

    await window.Kakao.Auth.setAccessToken(token);

    const statusInfo = await window.Kakao.Auth.getStatusInfo();

    const uid = SHA1(statusInfo.user.id).toString();
    const { data: customToken } = await getCustomToken(uid);
    const { user: account } = await signInWithCustomToken(auth, customToken);

    if (!auth.currentUser) {
      return;
    }
    if (!account.displayName) {
      await updateProfile(auth.currentUser, {
        displayName: statusInfo.user.kakao_account.profile.nickname,
      });
    }
    if (!account.photoURL) {
      await updateProfile(auth.currentUser, {
        photoURL: statusInfo.user.kakao_account.profile.thumbnail_image_url,
      });
    }
    if (!account.email) {
      await updateEmail(auth.currentUser, statusInfo.user.kakao_account.email);
    }

    const user = await userStore.fetchSingle({
      uid,
    });

    if (user === null) {
      const newUser: UserData = {
        uid,
        provider: 'naver' as const,
        profileImage: statusInfo.user.kakao_account.profile.thumbnail_image_url,
        name: statusInfo.user.kakao_account.profile.nickname,
        birth: null,
        church: null,
        department: null,
        grade: null,
        group: null,
        phone: '',
        role: null,
        isAccepted: false,
        isRejected: false,
        rejectedReason: '',
      };
      await userStore.createSingle(newUser);
      accountStore.composeAccountData(account, newUser);
    } else {
      accountStore.composeAccountData(account, user);
    }

    router.push({ name: 'HomeView' });
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped></style>
