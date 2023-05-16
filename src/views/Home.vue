<template>
  <div id="home">
    <h1>Цены на такси по маршруту </h1>
    <div class="input-group mb-3">
      <dadata-suggestions style="width: 100%;" v-model="addressFrom" :fullInfo.sync="addressfullFrom" field-value="value"
        placeholder="Адрес отправления" @input="initAddressFrom" type="ADDRESS" />
    </div>
    <div class="input-group mb-3">
      <dadata-suggestions style="width: 100%;" v-model="addressTo" :fullInfo.sync="addressfullTo" field-value="value"
        placeholder="Адрес прибытия" @input="initAddressTo" type="ADDRESS" @click="initAddressTo" />
    </div>


    <div class="form-group row">
      <div class="form-group mr-5 col-md-3">
        <button class="btn btn-primary btn-lg btn-block" @click="fetchPrices">
          <span>Рассчитать</span>
        </button>
      </div>
      <div class="form-group mr-5 col-md-3">
        <button class="btn btn-success btn-lg btn-block" @click="addOrderHistoryPrice">
          <span>Заказать историю цен</span>
        </button>
      </div>
    </div>
    <div v-if="loadingPrices">
      <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_mirwmzd6.json" background="transparent" speed="1"
        style="width: 300px; height: 300px;" loop autoplay></lottie-player>
    </div>
    <ul v-else>
      <li v-for="(taxiPrice, index) in prices.taxiPrices" v-bind:key="index">
        {{ taxiPrice.price }}
        <br>
        {{ taxiPrice.nameTaxi }}
      </li>
      <div v-if="addressFrom !== null && addressTo !== null">
        <ListHistoryPrice :longitudeFrom="addressfullFromFinish.data.geo_lon"
          :latitudeFrom="addressfullFromFinish.data.geo_lat" :longitudeTo="addressfullToFinish.data.geo_lon"
          :latitudeTo="addressfullToFinish.data.geo_lat" />
      </div>
    </ul>
    <div class="form-group">
      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
    </div>

  </div>
</template>

<script>
import PriceService from "../services/priceService";
import EventBus from "../common/EventBus";
import "@lottiefiles/lottie-player";
import ListHistoryPrice from "@/components/ListHistoryPrice";


export default {
  name: "Home",
  components: {
    ListHistoryPrice
  },
  data() {
    return {
      addressFrom: null,
      addressfullFrom: {
        data: {
          geo_lat: "",
          geo_lon: ""
        }
      },
      addressTo: null,
      addressfullTo: {
        data: {
          geo_lat: "",
          geo_lon: ""
        }
      },
      addressfullFromFinish: null,
      addressfullToFinish: null,
      message: '',

      prices: {
        taxiPrices: []
      },
      loadingPrices: false
    };
  },
  methods: {
    initAddressFrom() {
      if (this.addressfullFrom !== null) {
        this.addressfullFromFinish = this.addressfullFrom
      }
    },
    initAddressTo() {
      if (this.addressfullTo !== null)
        this.addressfullToFinish = this.addressfullTo
    },
    isNotNullAddress() {
      if (
        this.addressFrom !== null && typeof this.addressfullFromFinish["data"] !== undefined
        && this.addressTo !== null && typeof this.addressfullToFinish["data"] !== undefined
        && this.addressFrom !== "" && this.addressTo !== ""
      )
        return true
      else
        return false
    },
    async fetchPrices() {
      try {
        this.loadingPrices = true;
        if (this.isNotNullAddress()) {
          const response = await PriceService.getPrices(
            this.addressFrom,
            this.addressTo,
            this.addressfullFromFinish.data.geo_lon,
            this.addressfullFromFinish.data.geo_lat,
            this.addressfullToFinish.data.geo_lon,
            this.addressfullToFinish.data.geo_lat
          )

          this.prices = JSON.parse(JSON.stringify(response.data));
        }
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
    },

    async addOrderHistoryPrice() {
      try {
        if (this.isNotNullAddress()) {
          const response = await PriceService.orderHistoryPrices(
            this.addressFrom,
            this.addressTo,
            this.addressfullFromFinish.data.geo_lon,
            this.addressfullFromFinish.data.geo_lat,
            this.addressfullToFinish.data.geo_lon,
            this.addressfullToFinish.data.geo_lat
          )
          this.successResponse = JSON.parse(JSON.stringify(response.data));
          alert("Успешно заказана история цен!")
        }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          alert("Для заказа истории цен необходимо авторизироваться!")
        }
        else if (e.response && e.response.status === 429) {
          this.message = "На сегодня превышен лимит заказа историй цен!\nЛимит = 1 заказ в сутки."
          // alert("На сегодня превышен лимит заказа историй цен!\nЛимит = 1 заказ в сутки.")
        }
        // alert(e.message);
      }
    }
  }
};
</script>

<style>
.inputAddress {
  width: 10%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>