import Vue from "vue";
import store from "./store"; // import store from new directory
import App from "./App.vue";
import "./styles/global.scss";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
