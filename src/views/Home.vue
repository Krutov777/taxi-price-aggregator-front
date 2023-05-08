<template>
  <div id="home">
    <h1>Цены на такси по маршруту </h1>
    <div>
      Адрес отправления
      <dadata-suggestions style="width: 100%;" v-model="addressFrom" :fullInfo.sync="addressfullFrom" field-value="value"
        @input="initAddressFrom" type="ADDRESS" />
      <!-- <p v-if="typeof addressfullFrom.data !== 'undefined'">
        addressFrom : <br />
        {{ addressFrom }}
        <br />
        {{ addressfullFrom["data"]["geo_lat"] }}
        <br />
        {{ addressfullFrom["data"]["geo_lon"] }}
      </p>
      {{ addressfullFrom }} -->

      Адрес прибытия
      <dadata-suggestions style="width: 100%;" v-model="addressTo" :fullInfo.sync="addressfullTo" field-value="value"
        @input="initAddressTo" type="ADDRESS" @click="initAddressTo" />
      <!-- {{ addressfullTo }}
      <p v-if="typeof addressfullTo.data !== 'undefined'">
        addressTo : <br />
        {{ addressTo }}
        <br />
        {{ addressfullTo["data"]["geo_lat"] }}
        <br />
        {{ addressfullTo["data"]["geo_lon"] }}
      </p> -->
    </div>
    <div class="form-group">
      <button class="btn btn-primary btn-block" @click="fetchPrices">
        <!-- <span v-show="loading" class="spinner-border spinner-border-sm"></span> -->
        <span>Расчитать</span>
      </button>
      <h4 v-if="loading">Loading...</h4>
      <ul>
        <!-- v-bind:price="taxiPrice.price -->
        <li v-for="(taxiPrice, index) in prices.taxiPrices" v-bind:key="index">
          {{ taxiPrice.price }}
          <br>
          {{ taxiPrice.nameTaxi }}
        </li>
      </ul>
      <!-- <li ref="taxiPrice" class="list-group-item" v-for="taxiPrice in prices.taxiPrices" :key=taxiPrice>
        {{ taxiPrice.price }}
        {{ console.log("lol") }}
      </li> -->
    </div>
    <div class="form-group">
      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import PriceService from "../services/priceService";
// import axios from 'axios';

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
      addressfullFrom1: null,
      addressfullTo1: null,
      message: '',

      prices: {
        taxiPrices: [
          {
            nameTaxi: "Uber",
            price: 442,
            currency: "€",
            dateTime: "2023-05-08T20:16:35.961+00:00",
            dateTimeNumber: 1683576995961
          },
          {
            nameTaxi: "Bolt (Taxify)",
            price: 442,
            currency: "€",
            dateTime: "2023-05-08T20:16:35.961+00:00",
            dateTimeNumber: 1683576995961
          },
          {
            nameTaxi: "Cabify",
            price: 442,
            currency: "€",
            dateTime: "2023-05-08T20:16:35.961+00:00",
            dateTimeNumber: 1683576995961
          }
        ]
      },
      loading: false,
    };
  },
  methods: {
    initAddressFrom() {
      if (this.addressfullFrom !== null) {
        this.addressfullFrom1 = this.addressfullFrom
      }
    },
    initAddressTo() {
      if (this.addressfullTo !== null)
        this.addressfullTo1 = this.addressfullTo
    },
    async fetchPrices() {
      try {
        this.loading = true;
        const response = await PriceService.getPrices(
          this.addressFrom,
          this.addressTo,
          this.addressfullFrom1['data']['geo_lon'],
          this.addressfullFrom1['data']['geo_lat'],
          this.addressfullTo1['data']['geo_lon'],
          this.addressfullTo1['data']['geo_lat']
        )
        this.prices = JSON.parse(JSON.stringify(response.data));
        this.loading = false;
        // const response = await axios.get("http://localhost:80/taxi-aggregator/api/prices", {
        //   params: {
        //     fromAddress: this.addressFrom,
        //     toAddress: this.addressTo,
        //     longitudeFrom: this.addressfullFrom1['data']['geo_lon'],
        //     latitudeFrom: this.addressfullFrom1['data']['geo_lat'],
        //     longitudeTo: this.addressfullTo1['data']['geo_lon'],
        //     latitudeTo: this.addressfullTo1['data']['geo_lat'],
        //   },
        // });
        // this.prices = JSON.parse(JSON.stringify(response.data));
        // this.loading = false;
      } catch (e) {
        alert(e.message);
      }
      // try {
      //   let path = "http://localhost/taxi-aggregator/api/prices?fromAddress=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C%20%D0%9C%D0%B0%D0%BB%D1%8B%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%D0%B9%20%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%BD%D1%8B%2C%2036-38&toAddress=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C%20%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%B0%D1%8F%20%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%2067&longitudeFrom=30.293644&latitudeFrom=59.958453&longitudeTo=59.92956&latitudeTo=30.296671"
      //   console.log(path)
      //   this.loading = true;
      //   const response = await axios.get(path);
      //   this.prices = JSON.parse(JSON.stringify(response.data));
      //   this.loading = false;
      // } catch (e) {
      //   alert(e.message)
      // }
    },

    // async fetchPrices() {
    //   try {
    //     this.loading = true;
    //     // alert("cock suck")
    //     const addressFrom = this.addressFrom
    //     const addressTo = this.addressTo
    //     const addressFromLon = this.addressfullFrom1['data']['geo_lon']
    //     const addressFromLat = this.addressfullFrom1['data']['geo_lat']
    //     const addressToLon = this.addressfullTo1['data']['geo_lon']
    //     const addressToLat = this.addressfullTo1['data']['geo_lat']

    //     // alert(`${addressFrom}     ${addressTo}    ${addressFromLon}   ${addressFromLat}    ${addressToLon}     ${addressToLat}`)
    //     // if (this.addressFrom !== null && typeof this.addressfullFrom["data"] !== undefined && this.addressTo !== null && typeof this.addressfullTo["data"] !== undefined) {
    //     const response = await PriceService.getPrices(addressFrom, addressTo, addressFromLon, addressFromLat, addressToLon, addressToLat)
    //     this.prices = JSON.parse(JSON.stringify(response.data));
    //     console.log(JSON.parse(JSON.stringify(response.data)));
    //     this.loading = false;
    //   } catch (e) {
    //     alert(e.message);
    //   }
    // .then((response) => {
    //   const data = response.data;
    //   this.prices = JSON.parse(JSON.stringify(data));
    //   console.log(JSON.parse(JSON.stringify(response.data)));
    //   this.loading = false;
    //   // this.$refs.taxiPrices = this.prices;
    // })
    // .catch((e) => {
    //   console.log(e);
    // });
  }
  // this.$nextTick(function () {
  //   console.log(this.$el.textContent) // => 'updated'
  // })
  // this.prices = "asdsadsadsadads"
  // console.log(this.prices)
  // }
  //   getPrices() {
  //     return this.prices
  //   }
  // },
  // mounted() {
  //   this.fetchPrices()
  // }
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