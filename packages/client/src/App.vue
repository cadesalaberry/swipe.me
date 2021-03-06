<template>
  <div id="app">
    <md-avatar class="profile-bar md-elevation-8"
               v-if="shouldShowAvatar"
               v-on:click.native="onProfileClick()">
      <img v-if="isAuthenticated" :title="userEmail" :src="userPicture">
      <md-icon v-if="!isAuthenticated">lock</md-icon>
    </md-avatar>
    <router-view></router-view>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active="!!globalError" md-persistent>
      <span>{{ globalError }}</span>
      <md-button class="md-primary" @click="onDismissError">Dismiss</md-button>
    </md-snackbar>
    <md-dialog :md-active.sync="shouldShowPickUsernameDialog">
      <change-username @done="showPickUsernameDialog = false">
      </change-username>
    </md-dialog>
  </div>
</template>

<script>
import ChangeUsername from '@/components/ChangeUsername.vue'
import { Hub } from 'aws-amplify'

export default {
  name: 'App',
  components: {
    ChangeUsername
  },
  data () {
    return {
      showPickUsernameDialog: true,
      shouldShowAvatar: true
    }
  },
  watch: {
    $route ({ path }) {
      this.shouldShowAvatar = path !== '/profile'
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    shouldShowPickUsernameDialog () {
      return this.showPickUsernameDialog && this.$store.getters.isAuthenticated && !this.$store.getters.getCurrentUserHandle
    },
    currentUserHandle () {
      return this.$store.getters.getCurrentUserHandle
    },
    userPicture () {
      return this.$store.getters.getProfilePicture
    },
    userEmail () {
      return this.$store.getters.getUserEmail
    },
    globalError () {
      return this.$store.getters.getGlobalError
    }
  },
  mounted () {
    this.shouldShowAvatar = this.$route.path !== '/profile'

    Hub.listen('auth', (reply) => {
      const event = reply.payload.event
      const data = reply.payload.data
      const cognitoUsername = data?.username

      switch (event) {
        case 'signIn':
          console.log('now the user is signed in', data)
          this.$store.commit('setCognitoUsername', cognitoUsername)
          this.$store.dispatch('fetchUserInfos')
            .then(() => {
              const { currentUserHandle } = this

              this.$store.dispatch('fetchAllDecksByOwnerHandle', currentUserHandle)
            })

          break
        case 'signIn_failure':
          console.log('the user failed to sign in')
          console.log('the error is', data)

          this.$store.commit('setGlobalError', data)
          break
        case 'oAuthSignOut':
          console.log('Signing out user', cognitoUsername)
          console.log('the payload is', data)

          this.$store.commit('resetState')
          break
        default:
          console.warn('an auth event was received but not used', reply)
          break
      }
    })
  },
  methods: {
    onDismissError () {
      this.$store.commit('setGlobalError', null)
    },
    async onProfileClick () {
      if (this.isAuthenticated) {
        return this.$router.push('/profile')
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
#app textarea {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
