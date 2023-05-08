import axios from "axios";

const instance = axios.create({baseURL: "http://localhost:80/taxi-aggregator/api"});

export default instance;
