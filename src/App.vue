<template>
  <div id="app">
    <header>
      <h1>Colored pipeline</h1>
    </header>
    <main>
      <Controls />
      <MapboxMap />
    </main>
  </div>
</template>

<script>
import MapboxMap from "./components/MapboxMap.vue";
import Controls from "./components/Controls.vue";

export default {
  name: "App",
  components: {
    MapboxMap,
    Controls,
  },
};
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
main {
  position: relative;
  padding: 0 5% 5%;
}
</style>
