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

    <div class="form-group">
      <button class="btn btn-primary btn-lg" @click="fetchPrices">
        <span>Рассчитать</span>
      </button>
      <div v-if="loading">
        <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_mirwmzd6.json" background="transparent"
          speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
      </div>
      <ul v-else>
        <li v-for="(taxiPrice, index) in prices.taxiPrices" v-bind:key="index">
          {{ taxiPrice.price }}
          <br>
          {{ taxiPrice.nameTaxi }}
        </li>
      </ul>
    </div>
    <div class="form-group">
      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import PriceService from "../services/priceService";
import EventBus from "../common/EventBus";
import "@lottiefiles/lottie-player";


export default {
  name: "Home",
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
        taxiPrices: [
          // {
          //   nameTaxi: "Uber",
          //   price: 442,
          //   currency: "€",
          //   dateTime: "2023-05-08T20:16:35.961+00:00",
          //   dateTimeNumber: 1683576995961
          // },
          // {
          //   nameTaxi: "Bolt (Taxify)",
          //   price: 442,
          //   currency: "€",
          //   dateTime: "2023-05-08T20:16:35.961+00:00",
          //   dateTimeNumber: 1683576995961
          // },
          // {
          //   nameTaxi: "Cabify",
          //   price: 442,
          //   currency: "€",
          //   dateTime: "2023-05-08T20:16:35.961+00:00",
          //   dateTimeNumber: 1683576995961
          // }
        ]
      },
      loading: false,
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
    async fetchPrices() {
      try {
        this.loading = true;
        if (this.addressFrom !== null && typeof this.addressfullFromFinish["data"] !== undefined && this.addressTo !== null && typeof this.addressfullToFinish["data"] !== undefined) {
          const response = await PriceService.getPrices(
            this.addressFrom,
            this.addressTo,
            this.addressfullFromFinish['data']['geo_lon'],
            this.addressfullFromFinish['data']['geo_lat'],
            this.addressfullToFinish['data']['geo_lon'],
            this.addressfullToFinish['data']['geo_lat']
          )

          this.prices = JSON.parse(JSON.stringify(response.data));
        }
        this.loading = false;
      } catch (e) {
        if (e.response && e.response.status === 401) {
          EventBus.dispatch("logout");
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