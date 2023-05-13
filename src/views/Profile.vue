<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{ currentUser.username }}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Email:</strong>
      {{ currentUser.email }}
    </p>
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
        labels: [
          // 'January',
          // 'February',
          // 'March',
          // 'April',
          // 'May',
          // 'June',
          // 'July'
        ],
        datasets: [
          // {
          //   label: 'Data One',
          //   borderColor: 'rgb(65,105,225)', //royalblue
          //   backgroundColor: 'rgba(65,105,225,0.5)',
          //   fill: false,
          //   data: [30, 29, 20, 30, 29, 80, 40],
          //   pointStyle: 'circle',
          //   pointRadius: 6,
          //   tension: 0.1
          // },
        ],
        fromAddress: null,
        toAddress: null
      },
      chartData: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false
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
    async fetchHistoryPrices() {
      try {
        this.loading = true;
        const response = await PriceService.getHistoryPrices(1);
        this.historyPrices = JSON.parse(JSON.stringify(response.data)).historyPrices;
        for (const historyItem of this.historyPrices) {
          this.chartDataItem.datasets = [];
          this.chartDataItem.fromAddress = historyItem.fromAddress;
          this.chartDataItem.toAddress = historyItem.toAddress;
          const pricesGroupedByDateTime = historyItem.prices.reduce((group, price) => {
            const { dateTimeNumber } = price;
            group[dateTimeNumber] = group[dateTimeNumber] ?? [];
            group[dateTimeNumber].push(price);
            return group;
          }, {});
          const sortedPrices = Object.keys(pricesGroupedByDateTime).sort().reduce(
            (obj, key) => {
              obj[key] = pricesGroupedByDateTime[key];
              return obj;
            },
            {}
          );
          const listDateTime = Object.keys(sortedPrices).slice(-40);
          this.chartDataItem.labels = listDateTime.map(dateTimeNumber => new Date(parseInt(dateTimeNumber)).toLocaleString());
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
                data: points.slice(-40),
                tension: 0.3
              }
            )
          }
          this.chartData.push(this.chartDataItem)
        }
        // uniqueNamesTaxi.forEach(nameTaxi => {
        //   let points = listPriceObjects.map(priceObjects => priceObjects.filter(priceObject => priceObject.nameTaxi === nameTaxi));
        //   points = points.map(priceObjects => priceObjects[0].price);
        //   // console.log(points)
        // this.chartData.datasets.push(
        //   {
        //     label: nameTaxi,
        //     // borderColor: 'rgb(65,105,225)', //royalblue
        //     // backgroundColor: 'rgba(65,105,225,0.5)',
        //     fill: false,
        //     pointStyle: 'circle',
        //     pointRadius: 6,
        //     data: points.slice(-10)
        //     // return [...new Set(priceList.map(obj => obj.nameTaxi))]
        //   }
        // )
        // })
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
    this.fetchHistoryPrices()
  },
};
</script>
