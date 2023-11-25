<template>
  <section class="bg-custom flex flex-col justify-between px-5 py-8">
    <div class="text-center text-lg text-[#f5e1da]">
      <h1 class="text-3xl font-bold">오두막</h1>
      <h3>아이들과 가까워지는 곳</h3>
    </div>

    <Image :src="logoTransparent" />

    <div class="flex flex-col gap-3">
      <a class="flex items-center rounded bg-[#fee500] p-2" :href="`${odumakApiUrl}/oauth/kakao`">
        <Image :src="loginKakao" image-class="w-8" />
        <p class="mx-auto">카카오로 시작하기</p>
      </a>

      <a class="flex items-center rounded bg-[#03c75a] p-2" :href="`${odumakApiUrl}/oauth/naver`">
        <Image :src="loginNaver" image-class="w-8 mr-2" />
        <p class="mx-auto text-white">네이버로 시작하기</p>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import loginKakao from '@/assets/images/login-kakao.png';
import loginNaver from '@/assets/images/login-naver.png';
import logoTransparent from '@/assets/images/logo-transparent.png';

const odumakApiUrl = import.meta.env.VITE_ODUMAK_API_URL;
</script>

<style scoped>
.bg-custom {
  background: linear-gradient(
    300deg,
    #94a3b8 15%,
    #8c93ae 25%,
    #8882a2 45%,
    #867193 65%,
    #855f80 90%,
    #834d6a 100%
  );
}
</style>
