<template>
  <div class="container">
    <header class="profileInfo">
      <div class="card" style="width: 32rem;">
        <div class="card-body">
          <h4 class="card-title">Профиль</h4>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Логин:</strong> {{ userInfo.login }}</li>
          <li class="list-group-item"><strong>Email:</strong> {{ userInfo.email }}</li>
          <li class="list-group-item"><strong>Имя:</strong> {{ userInfo.firstName }}</li>
          <li class="list-group-item"><strong>Фамилия:</strong> {{ userInfo.lastName }}</li>
        </ul>
      </div>
    </header>


    <div v-if="loading">
      <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_mirwmzd6.json" background="transparent" speed="1"
        style="width: 300px; height: 300px;" loop autoplay></lottie-player>
    </div>
    <li v-for="(taxiPrice, index) in prices.taxiPrices" v-bind:key="index">
      {{ taxiPrice.price }}
      <br>
      {{ taxiPrice.nameTaxi }}
    </li>
    <ListHistoryPrice :typeHistoryPrice="'profile'" />

  </div>
</template>

<script>
import EventBus from "../common/EventBus";
import PriceService from "../services/priceService";
import ListHistoryPrice from "@/components/ListHistoryPrice";
import "@lottiefiles/lottie-player";
import UserService from "../services/userService";

export default {
  name: "Profile",
  components: {
    ListHistoryPrice
  },
  data() {
    return {
      prices: {
        taxiPrices: []
      },
      userInfo: null,
      loadingPrices: false,
      message: '',
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    async fetchHistoryPricesByUser() {
      try {
        this.loadingPrices = true;
        const response = await PriceService.getHistoryPricesByUser()
        this.prices = JSON.parse(JSON.stringify(response.data));

        this.loadingPrices = false;
      } catch (e) {
        if (e.response && e.response.status === 401) {
          EventBus.dispatch("logout");
        }
        else if (e.response && e.response.status === 429) {
          this.message = "Превышен лимит запросов!"
        }
      }
    },
    async fetchUserInfo() {
      try {
        const response = await UserService.getUserInfo();
        this.userInfo = JSON.parse(JSON.stringify(response.data));
      } catch (e) {
        if (e.response && e.response.status === 401) {
          EventBus.dispatch("logout");
        }
        else if (e.response && e.response.status === 429) {
          this.message = "Превышен лимит запросов!"
        }
      }
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchHistoryPricesByUser();
    this.fetchUserInfo();
  },
};
</script>
<style>
.profileInfo {
  padding-top: 3%;
}
</style>