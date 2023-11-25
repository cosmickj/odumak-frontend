<template>
  <div class="px-6 pb-8">
    <RouterLink class="core" :to="{ name: 'AttendanceChecker' }">
      <span>출석 체크 하러 가기</span>
    </RouterLink>
  </div>
</template>

<style>
.core {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  animation: soaring 0.8s ease-in-out;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
  will-change: box-shadow, transform;
  box-shadow:
    rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  border: 0;
  border-radius: 6px;
  background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
  padding-right: 16px;
  padding-left: 16px;
  width: 100%;
  height: 48px;
  touch-action: manipulation;
  color: #fff;
  font-size: 1.25rem;
  line-height: 1.75rem;
  user-select: none;
}

.core:focus {
  box-shadow:
    #3c4fe0 0 0 0 1.5px inset,
    rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #3c4fe0 0 -3px 0 inset;
}

.core:hover {
  transform: translateY(-2px);
  box-shadow:
    rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #3c4fe0 0 -3px 0 inset;
}

.core:active {
  transform: translateY(2px);
  box-shadow: #3c4fe0 0 3px 7px inset;
}

@keyframes soaring {
  0% {
    transform: translate(0, 100%);
  }
  50% {
    transform: translate(0, -20%);
  }
}
</style>
