import api, { getPipeGroups } from "@/services/MapService";

export const namespaced = true;

export const state = {
  map: null,
  pipes: [],
  groups: {},
  loading: false,
};

export const getters = {
  pipes: (state) => state.pipes,
  map: (state) => state.map,
  groups: (state) => state.groups,
  loading: (state) => state.loading,
};

export const actions = {
  async createMap({ commit }, mapId) {
    try {
      commit("setLoading", true);
      const response = await api.getPipes();
      const data = response.data;
      commit("setPipes", data);
      const map = api.createMap(mapId);
      commit("setMap", map);
      api.loadDataToMap(map, data, commit);
      const groups = getPipeGroups(data.features);
      commit("setGroups", groups);
      // commit('setLoading', false);
    } catch {
      commit("setPipes", {});
      console.log("Error of loading pipeline data");
      commit("setLoading", false);
    }
  },
  updateMap(map, data) {
    api.updateMapSource(map, data);
  },
};

export const mutations = {
  setPipes: (state, pipes) => {
    state.pipes = pipes;
  },
  setGroups: (state, groups) => {
    state.groups = groups;
  },
  setMap: (state, map) => {
    state.map = map;
  },
  setLoading: (state, value) => {
    state.loading = value;
  },
};
