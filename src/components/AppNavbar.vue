<template>
  <div class="z-5 relative flex justify-content-evenly align-items-center h-6rem border-round shadow">
    <div class="flex flex-column justify-content-center align-items-center">
      <router-link :to="{ name: 'AppHome' }" class="p-2">
        <i class="pi pi-home" style="font-size: 2rem"></i>
      </router-link>
      <div>메인 화면</div>
    </div>

    <div class="flex flex-column justify-content-center align-items-center">
      <router-link :to="{ name: 'AttendanceInput' }" class="p-2 bg-yellow-500 border-round shadow">
        <i class="pi pi-plus" style="font-size: 2rem"></i>
      </router-link>
      <div>출석 입력</div>
    </div>

    <div class="flex flex-column justify-content-center align-items-center">
      <router-link :to="{ name: 'AppUser' }" class="p-2">
        <i class="pi pi-user" style="font-size: 2rem"></i>
      </router-link>
      <div>내 정보</div>
    </div>
  </div>
</template>
