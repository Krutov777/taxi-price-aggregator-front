// import AuthService from "../services/authService";
// import PriceService from "../services/priceService";

// const user = JSON.parse(localStorage.getItem("user"));
// const initialState = user
//   ? { status: { loggedIn: true }, user }
//   : { status: { loggedIn: false }, user: null };

// export const price = {
//   namespaced: true,
//   state: initialState,
//   actions: {
//     getPrices({ commit }, addressFrom, addressfullFrom, addressTo, addressfullTo ) {
//       return AuthService.PriceService(addressFrom, addressfullFrom, addressTo, addressfullTo).then(
//         (prices) => {
//           commit("loginSuccess", user);
//           return Promise.resolve(user);
//         },
//         (error) => {
//           commit("loginFailure");
//           return Promise.reject(error);
//         }
//       );
//     },
//   },
//   mutations: {
//     loginSuccess(state, user) {
//       state.status.loggedIn = true;
//       state.user = user;
//     },
//     loginFailure(state) {
//       state.status.loggedIn = false;
//       state.user = null;
//     },
//   },
// };
