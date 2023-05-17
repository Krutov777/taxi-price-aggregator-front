<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{ currentUser.username }}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Тут данные о пользователе:</strong>
      <!-- <strong>Email:</strong>
      {{ currentUser.email }} -->
    </p>
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
        // alert(e.message);
      }
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchHistoryPricesByUser();
    let Script = document.createElement("script");
    Script.setAttribute("src", "//yastatic.net/taxi-widget/ya-taxi-widget.js");
    Script.setAttribute("charset", "UTF-8");
    document.head.appendChild(Script);
  },
};
</script>