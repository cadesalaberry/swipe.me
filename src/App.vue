<template>
  <router-view id="app"></router-view>
</template>

<script>
export default {
  name: 'App'
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
}
.card {
  height: 560px;
  width: 350px;
  border-radius: 4px;
  overflow: hidden;
}

@media all and (max-width: 360px) {
  .card {
    height: 450px;
    width: 280px;
  }
}
</style>
