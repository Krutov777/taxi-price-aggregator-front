<template>
    <div id="home">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <br>
        <div class="form-row">
            <div class="form-group mr-5 col-md-3">
                <div v-if="typeHistoryPrice === 'profile'">
                    <button class="btn btn-primary btn-lg btn-block" @click="fetchHistoryPricesByUser(); isHidden = false">
                        <span>Показать историю цен</span>
                    </button>
                </div>
                <div v-else>
                    <button class="btn btn-primary btn-lg btn-block"
                        @click="fetchHistoryPrices(undefined); isHidden = false">
                        <span>Показать историю цен</span>
                    </button>
                </div>
            </div>
            <div v-if="!isHidden" class="form-group mr-5 col-md-3">
                <button class="btn btn-info btn-lg btn-block" @click="hidePriceHistory(); isHidden = true">
                    <span class="material-icons-outlined">
                        Скрыть историю цен
                    </span>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div v-if="loading">
                <lottie-player src="https://assets8.lottiefiles.com/packages/lf20_yaPmtoEcXr.json" background="transparent"
                    speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>
            </div>
            <div v-else>
                <br>
                <div v-if="!isHidden && typeHistoryPrice === 'profile'" class="btn-group" role="group">
                    <h4 for="" class="mr-2">Фильтрация:</h4>
                    <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ currentfilterDateTime }}
                    </button>
                    <!-- filterHistoryPricesByDate -->
                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <button class="dropdown-item"
                            @click="fetchHistoryPricesByUser('day'); currentfilterDateTime = 'За последний день'; isHidden = false">За
                            последний день</button>
                        <button class="dropdown-item"
                            @click="fetchHistoryPricesByUser('week'); currentfilterDateTime = 'За последнюю неделю'; isHidden = false">За
                            последнюю
                            неделю</button>
                        <button class="dropdown-item"
                            @click="fetchHistoryPricesByUser('month'); currentfilterDateTime = 'За последний месяц'; isHidden = false">За
                            последний
                            месяц</button>
                        <button class="dropdown-item"
                            @click="fetchHistoryPricesByUser(undefined); currentfilterDateTime = 'По умолчанию'; isHidden = false">По
                            умолчанию</button>
                    </div>
                </div>

                <div v-if="!isHidden && typeHistoryPrice !== 'profile'" class="btn-group" role="group">
                    <h4 for="" class="mr-2">Фильтрация:</h4>
                    <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ currentfilterDateTime }}
                    </button>
                    <!-- filterHistoryPricesByDate -->
                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <button class="dropdown-item"
                            @click="fetchHistoryPrices('day'); currentfilterDateTime = 'За последний день'; isHidden = false">За
                            последний день</button>
                        <button class="dropdown-item"
                            @click="fetchHistoryPrices('week'); currentfilterDateTime = 'За последнюю неделю'; isHidden = false">За
                            последнюю
                            неделю</button>
                        <button class="dropdown-item"
                            @click="fetchHistoryPrices('month'); currentfilterDateTime = 'За последний месяц'; isHidden = false">За
                            последний
                            месяц</button>
                        <button class="dropdown-item"
                            @click="fetchHistoryPrices(undefined); currentfilterDateTime = 'По умолчанию'; isHidden = false">По
                            умолчанию</button>
                    </div>
                </div>
                <br><br>
                <div v-for="(item, index) in chartData" v-bind:key="index">

                    <div class="row">
                        <div class="col-sm-15">
                            <img src="../assets/outline_person_pin_circle_black_24dp.png">
                        </div>
                        <div class="col-sm-5 mr-3">
                            <div class="card" style="width: 64rem; height: 6rem;">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.fromAddress }}</h5>
                                    <p class="card-text">Откуда</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-15">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                class="bi bi-arrow-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                            </svg>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-15">
                            <img src="../assets/outline_fmd_good_black_24dp.png">
                        </div>
                        <div class="col-sm-5 mr-3">
                            <div class="card" style="width: 64rem; height: 6rem;">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.toAddress }}</h5>
                                    <p class="card-text">Куда</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <LineChartGenerator v-if="!loading" :chart-options="chartOptions" :chart-data="item" />
                    <br><br>

                </div>
            </div>
            <div class="form-group">
                <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
            </div>

        </div>
    </div>
</template>
  
<script>
import PriceService from "../services/priceService";
import EventBus from "../common/EventBus";
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
    name: "Home",
    components: {
        LineChartGenerator
    },
    props: {
        longitudeFrom: {
            type: String,
            required: false
        },
        latitudeFrom: {
            type: String,
            required: false
        },
        longitudeTo: {
            type: String,
            required: false
        },
        latitudeTo: {
            type: String,
            required: false
        },
        typeHistoryPrice: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentfilterDateTime: 'По умолчанию',
            loading: false,
            historyPrices: {},
            isHidden: true,
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
                },
            },
            message: ""
        };
    },
    methods: {
        async fetchHistoryPrices(filterDateTime) {
            try {
                this.chartData = [];
                this.loading = true;
                const response = await PriceService.getHistoryPrices(
                    this.longitudeFrom,
                    this.latitudeFrom,
                    this.longitudeTo,
                    this.latitudeTo
                )
                this.historyPrices = JSON.parse(JSON.stringify(response.data)).historyPrices;

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
                    let sortedPrices = this.sortHistoryPriceByDateTime(pricesGroupedByDateTime);

                    sortedPrices = this.filterHistoryPricesByDelta(sortedPrices, 300000);

                    const listDateTime = Object.keys(sortedPrices).slice(-60).map(dateTimeNumber => new Date(parseInt(dateTimeNumber)).toLocaleDateString('ru-RU', { day: "numeric", month: "numeric", hour: "numeric", minute: "numeric" }));
                    this.chartDataItem.labels = listDateTime;

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
                                data: points.slice(this.chartDataItem.labels.length * -1),
                                tension: 0.3
                            }
                        )

                    }
                    this.chartData.push(this.chartDataItem)
                }

                this.prices = JSON.parse(JSON.stringify(response.data));
                this.loading = false;
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    EventBus.dispatch("logout");
                }
                else {
                    this.message = e.toString();
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
        },
        hidePriceHistory() {
            this.chartData = []
        },
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
                    let sortedPrices = this.sortHistoryPriceByDateTime(pricesGroupedByDateTime);

                    sortedPrices = this.filterHistoryPricesByDelta(sortedPrices, 300000);
                    const listDateTime = Object.keys(sortedPrices).slice(-60).map(dateTimeNumber => new Date(parseInt(dateTimeNumber)).toLocaleDateString('ru-RU', { day: "numeric", month: "numeric", hour: "numeric", minute: "numeric" }));
                    this.chartDataItem.labels = listDateTime;

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
    },
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