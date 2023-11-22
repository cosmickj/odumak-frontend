<template>
  <div class="flex h-screen items-center justify-center">
    <ProgressSpinner stroke-width="3" animation-duration="1.5s" />
  </div>
</template>

<script setup lang="ts">
import { signInWithCustomToken } from '@firebase/auth';
import { useCookies } from '@vueuse/integrations/useCookies';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase/config';
import { useUserStore } from '@/store/user';

const cookies = useCookies(['odumak_key']);
const router = useRouter();

const userStore = useUserStore();

onMounted(async () => {
  try {
    const { uid, token } = cookies.get('odumak_key');
    await signInWithCustomToken(auth, token);

    await userStore.fetchSingle({ uid });

    router.replace({ name: 'HomeView' });
  } catch (error) {
    throw Error((error as Error).message);
  } finally {
    cookies.remove('odumak_key', { path: '/' });
  }
});
</script>
