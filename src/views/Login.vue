<template>
  <div class="col-md-12">
    <div class="card card-container">
      <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_nc1bp7st.json" background="transparent" speed="1"
        style="width: 100%; height: 100%;" loop autoplay></lottie-player>
      <br>
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <input v-model.trim="email" placeholder="Email"
            :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }"
            type="text" class="form-control" id="email" />
          <small class="text-danger" v-if="$v.email.$dirty && !$v.email.required">Поле Email не должно быть
            пустым</small>
          <small class="text-danger" v-else-if="$v.email.$dirty && !$v.email.email">Введите корретный
            Email</small>
        </div>
        <div class="form-group">
          <input v-model.trim="password" :class="{
            invalid:
              ($v.password.$dirty && !$v.password.required)
              || ($v.password.$dirty && !$v.password.minLength || !$v.password.maxLength)
          }" type="password" placeholder="Пароль" class="form-control" id="password" />
          <small class="text-danger" v-if="$v.password.$dirty && !$v.password.required">
            Введите пароль
          </small>
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading" type="submit">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Авторизироваться</span>
          </button>
          <br>
          <a href="/reset_password" class="btn btn-primary btn-block">
            <span class="spinner-border-sm"></span>
            <span>Сбросить пароль</span>
          </a>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import "@lottiefiles/lottie-player";
import { email, required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      message: ''
    };
  },
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(8), maxLength: maxLength(20) }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      if (this.$v.$invalid) {
        this.loading = false;
        this.$v.$touch()
        return
      }
      const user = {
        email: this.email,
        password: this.password
      }

      if (this.email && this.password) {
        this.$store.dispatch('auth/login', user).then(
          () => {
            this.$router.push('/profile');
          },
          error => {
            this.loading = false;
            this.message =
              error.toString();
            this.message = "Неправильный email или пароль"
          }
        );
      }
      // });
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