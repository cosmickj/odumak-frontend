<template>
  <section class="flex flex-col px-5 py-8 bg-custom justify-between">
    <div class="text-lg text-center text-[#f5e1da]">
      <h1 class="text-3xl font-bold">오두막</h1>
      <h3>아이들과 가까워지는 곳</h3>
    </div>

    <Image :src="logoTransparent" />

    <div class="flex flex-col gap-3">
      <a
        class="flex gap-2 p-2 rounded bg-[#fee500] items-center justify-center cursor-pointer select-none"
        href="http://localhost:5050/oauth/kakao"
      >
        <Image :src="loginKakao" image-class="w-8" />
        <span class="leading-8 text-lg">카카오톡으로 시작하기</span>
      </a>

      <a
        class="flex gap-2 p-2 rounded bg-[#03c75a] items-center justify-center cursor-pointer select-none"
        href="http://localhost:5050/oauth/naver"
      >
        <Image :src="loginNaver" image-class="w-8" />
        <span class="leading-8 text-white text-lg">네이버로 시작하기</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import logoTransparent from '@/assets/images/logo-transparent.png';
import loginKakao from '@/assets/images/login-kakao.png';
import loginNaver from '@/assets/images/login-naver.png';
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
