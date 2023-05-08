<template>
  <div id="home">
    <h1>Цены на такси по маршруту </h1>
    <div>
      Введите адрес
      <dadata-suggestions
        v-model="query"
        :fullInfo.sync="addressfull"
        field-value="value"
        type="ADDRESS"
      />
      query : <br />
      {{ query }}
      <!-- {{ console.log(addressfull["data"] !== undefined) }} -->
      <br />
      addressfull["data"]["geo_lat"] <br />
      <!-- <div v-if="typeof addressfull !== 'undefined' && addressfull.hasOwnProperty('data')">
        <p v-if="addressfull['data'] !== undefined && addressfull['data'] !== null"> -->
          {{ addressfull["data"]["geo_lat"] }}
        <!-- </p>
      </div> -->
      <br />
      addressfull["data"]["geo_lon"] <br />
      <!-- <div v-if="typeof addressfull !== 'undefined' && addressfull.hasOwnProperty('data')">
        <p v-if="addressfull['data'] !== undefined && addressfull['data'] !== null"> -->
        {{ addressfull["data"]["geo_lon"] }}
        <!-- </p>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      query: null,
      addressfull: {
        data: {
          geo_lat: "",
          geo_lon: ""
        }
      }
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>