<template>
   <div id="map"></div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "MapboxMap",
  data() {
    return {
    };
  },
  mounted() {
    this.createMap('map');
  },
  computed: mapGetters('maps', ['map', 'pipes', 'groups']),
  methods: mapActions('maps',['createMap', 'updateMap'])
};
</script>

<style lang="scss" scoped>

#map {
    position: absolute;
    height: 500px;
    width: 100%;
    max-width: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    border: 1px solid darkgrey;
}
</style>
