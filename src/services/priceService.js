import api from "./api";

class PriceService {
  async getPrices(
    addressFrom,
    addressTo,
    addressFromLon,
    addressFromLat,
    addressToLon,
    addressToLat
  ) {
    try {
      return api.get("/prices", {
        params: {
          fromAddress: addressFrom,
          toAddress: addressTo,
          longitudeFrom: addressFromLon,
          latitudeFrom: addressFromLat,
          longitudeTo: addressToLon,
          latitudeTo: addressToLat,
        },
      });
    } catch (e) {
      alert(e.message);
    }
  }

  async getHistoryPricesByUser() {
    try {
      return api.get("/prices/history_user");
    } catch (e) {
      alert(e.message);
    }
  }

  async getHistoryPrices(
    addressFromLon,
    addressFromLat,
    addressToLon,
    addressToLat
  ) {
    try {
      return api.get("/prices/history", {
        params: {
          longitudeFrom: addressFromLon,
          latitudeFrom: addressFromLat,
          longitudeTo: addressToLon,
          latitudeTo: addressToLat,
        },
      });
    } catch (e) {
      alert(e.message);
    }
  }

  async orderHistoryPrices(
    addressFrom,
    addressTo,
    addressFromLon,
    addressFromLat,
    addressToLon,
    addressToLat
  ) {
    try {
      return api.post("/prices/history", {
        fromAddress: addressFrom,
        toAddress: addressTo,
        longitudeFrom: addressFromLon,
        latitudeFrom: addressFromLat,
        longitudeTo: addressToLon,
        latitudeTo: addressToLat,
      });
    } catch (e) {
      alert(e.message);
    }
  }
}

export default new PriceService();
