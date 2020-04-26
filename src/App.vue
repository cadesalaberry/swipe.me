<template>
  <div id="app">
    <md-avatar class="profile-bar md-elevation-8"  v-on:click.native="onProfileClick()">
      <img v-if="isAuthenticated" :title="userEmail" src="//lh3.googleusercontent.com/-ArNNO5jacX8/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJOtkZUGDPPkXTm3mwwBskO3eyYJ6Q.CMID/s64-c/photo.jpg">
      <md-icon v-if="!isAuthenticated">lock</md-icon>
    </md-avatar>
    <router-view></router-view>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active="!!globalError" md-persistent>
      <span>{{ globalError }}</span>
      <md-button class="md-primary" @click="onDismissError">Dismiss</md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    userEmail () {
      return this.$store.getters.getUserEmail
    },
    globalError () {
      return this.$store.getters.getGlobalError
    }
  },
  methods: {
    onDismissError () {
      this.$store.commit('setGlobalError', null)
    },
    async onProfileClick () {
      if (this.isAuthenticated) {
        return this.$store.dispatch('logoutUser')
      }
      this.$router.push('/login')
    }
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
