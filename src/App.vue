<template>
  <div id="app">
    <Deck msg="banana"/>
  </div>
</template>

<script>
import Deck from './components/Deck.vue'

export default {
  name: 'App',
  components: {
    Deck
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
</style>
