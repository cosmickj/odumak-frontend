<template>
  <div class="h-screen flex items-center justify-center">
    <ProgressSpinner stroke-width="3" animation-duration="1.5s" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useCookies } from '@vueuse/integrations/useCookies';
import { auth } from '@/firebase/config';
import { signInWithCustomToken } from '@firebase/auth';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const cookies = useCookies(['odumak_key']);

    const { uid, token } = cookies.get('odumak_key');
    await signInWithCustomToken(auth, token);

    await userStore.fetchSingle({ uid });

    router.replace({ name: 'HomeView' });
  } catch (error) {
    throw Error((error as Error).message);
  }
});
</script>
