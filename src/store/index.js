import Vuex from "vuex";
import Vue from "vue";
import * as maps from "@/store/modules/maps.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    maps,
  },
});
