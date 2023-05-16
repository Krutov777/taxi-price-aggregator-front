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
    <div class="btn-group" role="group">
      <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Фильтровать по дате
      </button>
      <!-- filterHistoryPricesByDate -->
      <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
        <button class="dropdown-item" @click="fetchHistoryPricesByUser('day')">За последний день</button>
        <button class="dropdown-item" @click="fetchHistoryPricesByUser('week')">За последнюю неделю</button>
        <button class="dropdown-item" @click="fetchHistoryPricesByUser('month')">За последний месяц</button>
        <button class="dropdown-item" @click="fetchHistoryPricesByUser(undefined)">По умолчанию</button>
      </div>
    </div>
    <br><br>
    <div v-if="loading">
      <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_mirwmzd6.json" background="transparent" speed="1"
        style="width: 300px; height: 300px;" loop autoplay></lottie-player>
    </div>
    <div v-else v-for="(item, index) in chartData" v-bind:key="index">
      <p>
        {{ item.fromAddress }} <strong>--></strong> {{ item.toAddress }}
      </p>
      <LineChartGenerator v-if="!loading" :chart-options="chartOptions" :chart-data="item" />
      <br><br>
    </div>

  </div>
</template>

<script>
import EventBus from "../common/EventBus";
import PriceService from "../services/priceService";
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
import "@lottiefiles/lottie-player";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)


export default {
  name: "Profile",
  components: {
    LineChartGenerator
  },
  data() {
    return {
      historyPrices: {},
      loading: false,
      chartDataItem: {
        labels: [],
        datasets: [],
        fromAddress: null,
        toAddress: null
      },
      chartData: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true
          }
        }
      },
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    filterDateTime(filterDateTime, historyPrices) {
      if (filterDateTime !== undefined) {
        let startDate = new Date();
        let endDate = new Date();
        if (filterDateTime === "day")
          startDate.setDate(endDate.getDate() - 1);
        else if (filterDateTime === "week")
          startDate.setDate(endDate.getDate() - 7);
        else if (filterDateTime === "month")
          startDate.setMonth(endDate.getMonth() - 1);
        historyPrices = historyPrices.filter(function (a) {
          var hitDates = a.dateTimeNumber;
          var date = new Date(hitDates);
          if (date >= startDate && date <= endDate)
            return date
        });
      }
      return historyPrices
    },
    groupPriceByDateTime(historyPrices) {
      const pricesGroupedByDateTime = historyPrices.reduce((group, price) => {
        const { dateTimeNumber } = price;
        group[dateTimeNumber] = group[dateTimeNumber] ?? [];
        group[dateTimeNumber].push(price);
        return group;
      }, {});
      return pricesGroupedByDateTime
    },
    sortHistoryPriceByDateTime(historyPrices) {
      return Object.keys(historyPrices).sort().reduce(
        (obj, key) => {
          obj[key] = historyPrices[key];
          return obj;
        },
        {}
      );
    },
    // для того чтобы выбрать элементы с delta 5 мин например
    filterHistoryPricesByDelta(sortedPrices, delta) {
      return Object.keys(sortedPrices)
        .filter(function (dateTime, i, arrayDateTime) {
          if (arrayDateTime.length - 2 >= i) {
            if (new Date(parseInt(arrayDateTime[i + 1])) - new Date(parseInt(dateTime)) > delta) {
              return dateTime
            }
          } else
            return dateTime
        })
        .reduce((obj, key) => {
          return Object.assign(obj, {
            [key]: sortedPrices[key]
          });
        }, {});
    },
    async fetchHistoryPricesByUser(filterDateTime) {
      try {
        this.loading = true;
        const response = await PriceService.getHistoryPricesByUser();
        this.historyPrices = JSON.parse(JSON.stringify(response.data)).historyPrices;
        this.chartData = [];
        for (const historyItem of this.historyPrices) {
          this.chartDataItem = {
            labels: [],
            datasets: [],
            fromAddress: null,
            toAddress: null
          }
          this.chartDataItem.fromAddress = historyItem.fromAddress;
          this.chartDataItem.toAddress = historyItem.toAddress;

          historyItem.prices = this.filterDateTime(filterDateTime, historyItem.prices);

          const pricesGroupedByDateTime = this.groupPriceByDateTime(historyItem.prices);
          // const pricesGroupedByDateTime = historyItem.prices.reduce((group, price) => {
          //   const { dateTimeNumber } = price;
          //   group[dateTimeNumber] = group[dateTimeNumber] ?? [];
          //   group[dateTimeNumber].push(price);
          //   return group;
          // }, {});
          // let sortedPrices = Object.keys(pricesGroupedByDateTime).sort().reduce(
          //   (obj, key) => {
          //     obj[key] = pricesGroupedByDateTime[key];
          //     return obj;
          //   },
          //   {}
          // );
          let sortedPrices = this.sortHistoryPriceByDateTime(pricesGroupedByDateTime);

          sortedPrices = this.filterHistoryPricesByDelta(sortedPrices, 300000);
          // sortedPrices = Object.keys(sortedPrices)
          //   .filter(function (dateTime, i, arrayDateTime) {
          //     if (arrayDateTime.length - 2 >= i) {
          //       if (new Date(parseInt(arrayDateTime[i + 1])) - new Date(parseInt(dateTime)) > 300000) {
          //         return dateTime
          //       }
          //     } else
          //       return dateTime
          //   })
          //   .reduce((obj, key) => {
          //     return Object.assign(obj, {
          //       [key]: sortedPrices[key]
          //     });
          //   }, {});
          const listDateTime = Object.keys(sortedPrices).slice(-60).map(dateTimeNumber => new Date(parseInt(dateTimeNumber)).toLocaleDateString('ru-RU', { day: "numeric", month: "numeric", hour: "numeric", minute: "numeric" }));
          this.chartDataItem.labels = listDateTime;

          // const listDateTime = Object.keys(sortedPrices).slice(-50);
          // this.chartDataItem.labels = listDateTime.map(dateTimeNumber => new Date(parseInt(dateTimeNumber)).toLocaleString());
          let listPriceObjects = Array.from(Object.values(sortedPrices));
          const uniqueNamesTaxi = [...new Set([].concat.apply([], listPriceObjects).map(obj => obj.nameTaxi))];

          for (let i = 0; i < uniqueNamesTaxi.length; i++) {
            let points = listPriceObjects.map(priceObjects => priceObjects.filter(priceObject => priceObject.nameTaxi === uniqueNamesTaxi[i]));
            points = points.map(function (priceObjects) {
              if (priceObjects.length != 0)
                return priceObjects[0].price
              else
                return NaN
            }
            );
            const color = this.chooseColor(uniqueNamesTaxi[i]);
            this.chartDataItem.datasets.push(
              {
                label: uniqueNamesTaxi[i],
                borderColor: color.borderColor,
                backgroundColor: color.backgroundColor,
                fill: false,
                pointStyle: 'circle',
                pointRadius: 4,
                // data: points,
                data: points.slice(this.chartDataItem.labels.length * -1),
                tension: 0.3
              }
            )
          }
          this.chartData.push(this.chartDataItem)
        }
        this.loading = false;
      } catch (e) {
        if (e.response && e.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    },
    chooseColor(nameTaxi) {

      if (nameTaxi === "Яндекс") {
        return {
          borderColor: 'rgb(65,105,225)', //royalblue
          backgroundColor: 'rgba(65,105,225,0.5)',
        }
      }
      else if (nameTaxi === "Uber") {
        return {
          borderColor: 'rgb(0, 200, 0)', //green
          backgroundColor: 'rgba(0, 200, 0, 0.5)',
        }
      }
      else if (nameTaxi === "Максим") {
        return {
          borderColor: 'rgb(255, 0, 0)', //red
          backgroundColor: 'rgba(255, 0, 0,0.5)',
        }
      }
      else if (nameTaxi === "InDriver") {
        return {
          borderColor: 'rgb(235,82,132)', //Глубокий пурпурно-розовый
          backgroundColor: 'rgba(235,82,132,0.5)',
        }
      }
      else {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return {
          borderColor: 'rgb(' + r + ', ' + g + ', ' + b + ')',
          backgroundColor: 'rgb(' + r + ', ' + g + ', ' + b + ', ' + 0.5 + ')',
        }
      }
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchHistoryPricesByUser()
  },
};
</script>
