import Vue from 'vue';
import App from './App.vue';
import { router } from './router/router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import * as VeeValidate from 'vee-validate';
import Vuelidate from 'vuelidate'
import Vuex from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DadataSuggestions from "vue-dadata-suggestions";
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import setupInterceptors from './services/setupInterceptors';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(DadataSuggestions, {
    token: "b2c49ff2d618faf4f30396c23d41d91b96b94496",
    type: "ADDRESS"
  });
  
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Vuex);

setupInterceptors(store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');