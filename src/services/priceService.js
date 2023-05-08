import api from "./api";
// import axios from "axios";

class PriceService {
  // async getPrices(
  //   addressFrom,
  //   addressTo,
  //   addressFromLon,
  //   addressFromLat,
  //   addressToLon,
  //   addressToLat
  // ) {
  //   return api
  //     .get("/prices", {
  //       params: {
  //         fromAddress: addressFrom,
  //         toAddress: addressTo,
  //         longitudeFrom: addressFromLon,
  //         latitudeFrom: addressFromLat,
  //         longitudeTo: addressToLon,
  //         latitudeTo: addressToLat,
  //       },
  //     })
  //     .then((response) => {
  //       return response;
  //     });
  // }

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
}

export default new PriceService();
