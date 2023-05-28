import axios from "axios";

// const instance = axios.create({baseURL: "http://localhost:80/taxi-aggregator/api"});
const instance = axios.create({
  baseURL: "https://cekasiekhos.beget.app/taxi-aggregator/api",
});

export default instance;
