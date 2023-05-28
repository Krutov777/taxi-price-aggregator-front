<template>
  <div>
    <h1>Цены на такси по маршруту </h1>
    <div class="row">
      <div class="col-sm-15">
        <img src="../assets/outline_person_pin_circle_black_24dp.png">
      </div>
      <div class="input-group mb-3 col-sm">
        <dadata-suggestions style="width: 100%;" v-model="addressFrom" :fullInfo.sync="addressfullFrom"
          field-value="value" placeholder="Адрес отправления" @input="initAddressFrom" type="ADDRESS" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-15">
        <img src="../assets/outline_fmd_good_black_24dp.png">
      </div>
      <div class="input-group mb-3 col-sm">
        <dadata-suggestions style="width: 100%;" v-model="addressTo" :fullInfo.sync="addressfullTo" field-value="value"
          placeholder="Адрес прибытия" @input="initAddressTo" type="ADDRESS" @click="initAddressTo" />
      </div>
    </div>
    <br>

    <div class="form-group row">
      <div class="form-group mr-5 col-md-3">
        <button class="btn btn-primary btn-lg btn-block" @click="fetchPrices">
          <span>Рассчитать</span>
        </button>
      </div>
      <div class="form-group mr-5 col-md-3">
        <button class="btn btn-success btn-lg btn-block" data-toggle="tooltip" data-placement="top"
          title="Заказывать историю цен может только авторизованный пользователь 1 раз в сутки."
          @click="addOrderHistoryPrice">
          <span>Заказать историю цен</span>
        </button>
      </div>
    </div>
    <div class="form-group">
      <div v-if="successfullMessage" class="alert alert-primary" role="alert">{{ successfullMessage }}</div>
    </div>
    <div class="form-group">
      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
    </div>
    <div v-if="loadingPrices">
      <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_mirwmzd6.json" background="transparent" speed="1"
        style="width: 300px; height: 300px;" loop autoplay></lottie-player>
    </div>
    <ul v-else>
      <div class="row">
        <div v-for="(taxiPrice, index) in   prices.taxiPrices  " v-bind:key="index">
          <div class="col-sm-15 mr-5">
            <div class="card" style="width: 18rem; height: 13rem;">
              <div class="card-header">
                <div class="form-row">
                  <img v-if="taxiPrice.nameTaxi === 'Яндекс'" class="mr-3"
                    src="https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_yandex_taxi_app.png" width="50x"
                    height="50px" alt="Card image cap">
                  <img v-else-if="taxiPrice.nameTaxi === 'Uber'" class="mr-3"
                    src="https://helios-i.mashable.com/imagery/articles/03y6VwlrZqnsuvnwR8CtGAL/hero-image.fill.size_1248x702.v1623372852.jpg"
                    width="50x" height="50px" alt="Card image cap">
                  <img v-else-if="taxiPrice.nameTaxi === 'Максим'" class="mr-3"
                    src="https://play-lh.googleusercontent.com/bRDRVxur-TaSGjNFs_UNbtE4lsmmXFNTPFHwYCifSkit-TDcpMK24iMUixN3zJ_Phdbl"
                    width="50x" height="50px" alt="Card image cap">
                  <img v-else class="mr-3"
                    src="https://sun9-56.userapi.com/impf/c604626/v604626359/1b56/hxAAyPi92Mc.jpg?size=800x800&quality=96&sign=85be3b0e6e2daedd7576a2d650fe2f45&c_uniq_tag=70sG1NEr_1ZIvG1r156n6l1mVjuRx9t3iJ_3_FodYiI&type=album"
                    width="50x" height="50px" alt="Card image cap">
                  <h3>{{ taxiPrice.nameTaxi }}</h3>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">Стоимость: {{ taxiPrice.price }} {{ taxiPrice.currency }}</h5>
                <a class="btn btn-primary" v-if="taxiPrice.nameTaxi === 'Яндекс'"
                  @click="createUrlYandexCall(addressfullFromFinish.data.geo_lon, addressfullFromFinish.data.geo_lat, addressfullToFinish.data.geo_lon, addressfullToFinish.data.geo_lat)"
                  v-bind:href="linkYandex">
                  <span>Заказать такси</span>
                </a>
                <a class="btn btn-primary" v-else-if="taxiPrice.nameTaxi === 'Uber'"
                  href="https://www.uber.com/global/ru/sign-in/">
                  <span>Заказать такси</span>
                </a>
                <a class="btn btn-primary" v-else-if="taxiPrice.nameTaxi === 'Максим'" href="https://taximaxim.ru/">
                  <span>Заказать такси</span>
                </a>
              </div>
            </div>
          </div>
          <br>
        </div>

      </div>
      <div v-if="addressFrom !== null && addressTo !== null">
        <ListHistoryPrice :longitudeFrom="addressfullFromFinish.data.geo_lon"
          :latitudeFrom="addressfullFromFinish.data.geo_lat" :longitudeTo="addressfullToFinish.data.geo_lon"
          :latitudeTo="addressfullToFinish.data.geo_lat" :typeHistoryPrice="'home'" />
      </div>

    </ul>

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
      linkYandex: "",
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
      loadingPrices: false,
      successfullMessage: '',
    };
  },
  methods: {
    createUrlYandexCall(geoLonFrom, geoLatFrom, geoLonTo, geoLatTo) {
      this.linkYandex = `https://3.redirect.appmetrica.yandex.com/route?start-lat=${geoLatFrom}&start-lon=${geoLonFrom}&end-lat=${geoLatTo}&end-lon=${geoLonTo}&level=50&ref=yoursiteru&appmetrica_tracking_id=1178268795219780156`;
    },
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
    clearMessages() {
      this.message = '',
        this.successfullMessage = ''
    },
    async fetchPrices() {
      try {
        this.clearMessages();
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
      }
    },

    async addOrderHistoryPrice() {
      try {
        this.clearMessages();
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
          this.successfullMessage = "Успешно заказана история цен!"
        }
      } catch (e) {
        if (e.response && e.response.status === 401 || e.response.status === 403) {
          this.message = "Для заказа истории цен необходимо авторизироваться!"
        }
        else if (e.response && e.response.status === 429) {
          this.message = "На сегодня превышен лимит заказа историй цен!\nЛимит = 1 заказ в сутки."
        }
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