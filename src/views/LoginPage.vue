<template>
  <div id="login">
    <div class="login__wrapper">
      <div class="login__container">
        <div class="title">당신의 섬김에 감사합니다.</div>
        <b-form @submit="onSubmit">
          <div class="input__field shadow">
            <b-form-input
              class="input__name"
              v-model="form.name"
              placeholder="이름을 입력하세요"
              type="text"
            ></b-form-input>
          </div>

          <div class="input__field shadow">
            <b-form-input
              class="input__password"
              v-model="form.password"
              placeholder="비밀번호를 입력하세요"
              type="text"
            ></b-form-input>
          </div>

          <b-button class="button__submit shadow" type="submit" block>
            <span>로그인</span>
          </b-button>
        </b-form>
        <!-- <div class="tree__wrapper">
          <span>Tree will be in here</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: null,
        password: null,
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$router.push("/main");
    },
  },
};
</script>

<style scoped>
#login {
  height: 100%;
}
.login__wrapper {
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.login__container {
  max-width: 500px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--container-padding);
}
.title {
  font-size: 1.6rem;
  color: var(--color-text-white);
  margin-bottom: 5px;
}
.input__field {
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 10px;
  background-color: var(--color-text-white);
  border: none;
}
.form-control:focus {
  box-shadow: none;
}
.input__name,
.input__password {
  min-width: 200px;
  height: 35px;
  border: none;
  outline: none;
  background: none;
  font-size: 1.2rem;
  color: var(--color-text);
  padding: 10px 15px 10px 10px;
}
.button__submit {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 10px;
  font-size: 2.5rem;
  padding: 15px;
  background-color: var(--color-btn-login);
  color: var(--color-text);
}
.button__submit:hover,
.button__submit:active,
.button__submit:visited {
  background-color: var(--color-btn-login) !important;
}
.tree__wrapper {
  border: 1px solid orange;
  flex-grow: 1;
}
</style>
