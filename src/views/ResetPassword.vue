<template>
  <div class="col-md-12">
    <div class="card card-container">
      <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_iwyr6aqu.json" background="transparent" speed="1"
        style="width: 100%; height: 100%;" loop autoplay></lottie-player>

      <br>
      <div name="form">
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
          <button @click="resetPassword" class="btn btn-primary btn-block" :disabled="loading" type="submit">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Сбросить пароль</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="successfullMessage" class="alert alert-primary" role="alert">{{ successfullMessage }}</div>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import "@lottiefiles/lottie-player";
import { email, required } from 'vuelidate/lib/validators'
import UserService from "../services/userService";
import EventBus from "../common/EventBus";

export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      loading: false,
      successfullMessage: '',
      message: ''
    };
  },
  validations: {
    email: { email, required }
  },
  methods: {
    clearMessages() {
      this.message = '',
        this.successfullMessage = ''
    },
    async resetPassword() {
      this.clearMessages();
      this.loading = true;
      if (this.$v.$invalid) {
        this.loading = false;
        this.$v.$touch()
        return
      }
      try {
        this.loading = true;
        await UserService.resetPassword(this.email)
        this.successfullMessage = `На указанную почту - ${this.email} было отправлено письмо с ссылкой на восстановление пароля`;
        this.loading = false;
      } catch (e) {
        if (e.response && e.response.status === 400) {
          this.message = e.response
        }
        else if (e.response && e.response.status === 401) {
          EventBus.dispatch("logout");
        }
        else if (e.response && e.response.status === 404) {
          this.message = "Пользователя с таким адресом электронной почты не существует!"
          this.loading = false;
        }
        else if (e.response && e.response.status === 429) {
          this.message = "Превышен лимит запросов!"
        }
      }
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