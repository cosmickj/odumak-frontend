<template>
  <div id="login">
    <div class="login__wrapper">
      <div class="login__container">
        <b-form @submit="onSubmit">
          <div class="input__field">
            <b-form-input
              class="input__name"
              v-model="form.name"
              type="text"
              placeholder="이름을 입력하세요"
            ></b-form-input>
          </div>

          <div class="input__field">
            <b-form-input
              class="input__password"
              v-model="form.password"
              type="text"
              placeholder="비밀번호를 입력하세요"
            ></b-form-input>
          </div>

          <b-button class="button__submit" type="submit" size="lg" block>
            <span>로그인</span>
          </b-button>
        </b-form>
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
      alert("submit");
    },
  },
};
</script>

<style scoped>
#login {
  background: var(--color-login);
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
  /* border: 1px solid black; */
  border-radius: 15px;
  padding: 40px 30px 30px 30px;
  margin-top: 100px;
  box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
}
.input__field {
  padding-left: 10px;
  margin-bottom: 20px;
  border-radius: 50px;
  box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
}
.form-control:focus {
  box-shadow: none;
}
.input__name,
.input__password {
  margin-bottom: 10px;
  min-width: 200px;
  height: 35px;
  border: none;
  outline: none;
  background: none;
  font-size: 1.2rem;
  color: #666;
  padding: 10px 15px 10px 10px;
}
.button__submit {
  border-radius: 50px;
}
</style>
