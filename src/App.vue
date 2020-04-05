<template>
 <div id="app">
    <md-avatar class="profile-bar md-elevation-8">
      <router-link to="/login">
        <img src="//lh3.googleusercontent.com/-ArNNO5jacX8/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJOtkZUGDPPkXTm3mwwBskO3eyYJ6Q.CMID/s64-c/photo.jpg">
      </router-link>
    </md-avatar>
  <router-view></router-view>
 </div>
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
  height: 100%;
}
.profile-bar {
  position: absolute;
  top: 10px;
  right: 30px;
  z-index: 1000;
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
