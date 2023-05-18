<template>
  <div class="col-md-12">
    <div class="card card-container">
      <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_nc1bp7st.json" background="transparent" speed="1"
        style="width: 100%; height: 100%;" loop autoplay></lottie-player>
      <br>
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username">Логин</label>
            <input v-model.trim="username" :class="{
              invalid:
                ($v.username.$dirty && !$v.username.required)
                || ($v.username.$dirty && !$v.username.minLength || !$v.username.maxLength)
            }" type="text" class="form-control" id="username" />
            <small class="text-danger" v-if="$v.username.$dirty && !$v.username.required">
              Введите Логин
            </small>
            <small class="text-danger" v-else-if="$v.username.$dirty && !$v.username.minLength || !$v.username.maxLength">
              Логин должен быть в пределах от {{ $v.username.$params.minLength.min }} до
              {{ $v.username.$params.maxLength.max }} символов. Сейчас он {{ username.length }}
            </small>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model.trim="email"
              :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }"
              type="text" class="form-control" id="email" />
            <small class="text-danger" v-if="$v.email.$dirty && !$v.email.required">Поле Email не должно быть
              пустым</small>
            <small class="text-danger" v-else-if="$v.email.$dirty && !$v.email.email">Введите корретный Email</small>
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input v-model.trim="password" :class="{
              invalid:
                ($v.password.$dirty && !$v.password.required)
                || ($v.password.$dirty && !$v.password.minLength || !$v.password.maxLength)
            }" type="password" class="form-control" id="password" />
            <small class="text-danger" v-if="$v.password.$dirty && !$v.password.required">
              Введите пароль
            </small>
            <small class="text-danger" v-else-if="$v.password.$dirty && !$v.password.minLength || !$v.password.maxLength">
              Пароль должен быть в пределах от {{ $v.password.$params.minLength.min }} до
              {{ $v.password.$params.maxLength.max }} символов. Сейчас он {{ password.length }}
            </small>
          </div>
          <div class="form-group">
            <label for="repeatPassword">Подтверждающий пароль</label>
            <input v-model.trim="repeatPassword" :class="{
              invalid:
                ($v.repeatPassword.$dirty && !$v.repeatPassword.required)
                || ($v.repeatPassword.$dirty && !$v.password.minLength || !$v.password.maxLength)
                || ($v.repeatPassword.$dirty && !$v.repeatPassword.sameAsPassword)
            }" type="password" class="form-control" id="repeatPassword" />
            <small class="text-danger" v-if="$v.repeatPassword.$dirty && !$v.repeatPassword.required">
              Введите подтверждающий пароль
            </small>
            <small class="text-danger"
              v-else-if="$v.repeatPassword.$dirty && !$v.repeatPassword.minLength || !$v.repeatPassword.maxLength">
              Пароль должен быть в пределах от {{ $v.repeatPassword.$params.minLength.min }} до
              {{ $v.repeatPassword.$params.maxLength.max }} символов. Сейчас он {{ repeatPassword.length }}
            </small>
            <small class="text-danger" v-if="$v.repeatPassword.$dirty && !$v.repeatPassword.sameAsPassword">
              Пароли не совпадают
            </small>
          </div>
          <div class="form-group">
            <label for="firstName">Имя</label>
            <input v-model.trim="firstName" :class="{
              invalid:
                ($v.firstName.$dirty && !$v.firstName.required)
                || ($v.firstName.$dirty && !$v.firstName.minLength || !$v.firstName.maxLength)
            }" type="text" class="form-control" id="firstName" />
            <small class="text-danger" v-if="$v.firstName.$dirty && !$v.firstName.required">
              Введите имя
            </small>
            <small class="text-danger"
              v-else-if="$v.firstName.$dirty && !$v.firstName.minLength || !$v.firstName.maxLength">
              Имя должено быть в пределах от {{ $v.firstName.$params.minLength.min }} до
              {{ $v.firstName.$params.maxLength.max }} символов. Сейчас оно {{ firstName.length }}
            </small>
          </div>
          <div class="form-group">
            <label for="surname">Фамилия</label>
            <input v-model.trim="surname" :class="{
              invalid:
                ($v.surname.$dirty && !$v.surname.required)
                || ($v.surname.$dirty && !$v.surname.minLength || !$v.surname.maxLength)
            }" type="text" class="form-control" id="surname" />
            <small class="text-danger" v-if="$v.surname.$dirty && !$v.surname.required">
              Введите Фамилию
            </small>
            <small class="text-danger" v-else-if="$v.surname.$dirty && !$v.surname.minLength || !$v.surname.maxLength">
              Фамилия должена быть в пределах от {{ $v.surname.$params.minLength.min }} до
              {{ $v.surname.$params.maxLength.max }} символов. Сейчас она {{ surname.length }}
            </small>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-show="loading" class="spinner-border spinner-border-sm"></span>
              <span>Зарегистрироваться</span>
            </button>
            <br>
            <a href="/reset_password" class="btn btn-primary btn-block" :disabled="loading">
              <span v-show="loading" class="spinner-border spinner-border-sm"></span>
              <span>Сбросить пароль</span>
            </a>
          </div>
        </div>
      </form>

      <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">Пользователь с таким email
        или логином уже существует</div>
    </div>
  </div>
</template>

<script>
import { email, required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import "@lottiefiles/lottie-player";

export default {
  name: 'Register',
  data() {
    return {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      firstName: "",
      surname: "",
      submitted: false,
      successful: false,
      message: '',
      loading: false,
    };
  },
  validations: {
    username: { required, minLength: minLength(2), maxLength: maxLength(20) },
    email: { email, required },
    password: { required, minLength: minLength(8), maxLength: maxLength(20) },
    repeatPassword: { required, minLength: minLength(8), maxLength: maxLength(20), sameAsPassword: sameAs('password') },
    firstName: { required, minLength: minLength(2), maxLength: maxLength(15) },
    surname: { required, minLength: minLength(2), maxLength: maxLength(20) },
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = "";
      this.successful = false;
      this.loading = true;
      if (this.$v.$invalid) {
        this.loading = false;
        this.$v.$touch()
        return
      }
      const user = {
        email: this.email,
        password: this.password,
        repeatPassword: this.repeatPassword,
        username: this.username,
        firstName: this.firstName,
        surname: this.surname
      }

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          alert("Подтвердите свою почту")
          this.$router.push('/login');
        },
        (error) => {
          this.message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>