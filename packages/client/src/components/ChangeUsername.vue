<template>
  <md-card-content>
    <form novalidate class="md-layout" @submit.prevent="changeUsername">
      <md-dialog-title v-if="!username">Pick your username</md-dialog-title>
      <md-dialog-title v-else>What would you like as your new username?</md-dialog-title>
      <md-field :class="errorMessage ? 'md-invalid' : ''">
        <label for="username">Username</label>
        <md-input type="username" name="username" id="username"
                  autocomplete="username"
                  v-model="newUsername" />
        <span v-if="errorMessage" class="md-error">{{ errorMessage }}</span>
      </md-field>
      <md-dialog-actions>
        <md-button class="md-primary" v-if="username" @click="cancelRequest">Cancel</md-button>
        <md-button class="md-primary" @click="changeUsername">Save</md-button>
      </md-dialog-actions>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </form>
  </md-card-content>
</template>

<script>
import * as Sentry from '@sentry/browser'

export default {
  name: 'ChangeUsername',
  props: {
    username: String
  },
  data () {
    return {
      newUsername: '',
      sending: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.newUsername = this.username || ''
  },
  methods: {
    cancelRequest () {
      this.$emit('done')
    },
    async changeUsername () {
      const { username, newUsername } = this
      const cognitoUsername = this.$store.getters.getCognitoUsername
      this.sending = true

      console.log(`Hello ${cognitoUsername}, we will change your username from "${username}" to "${newUsername}"`)

      try {
        await this.$store.dispatch('changePreferredUsername', {
          username: cognitoUsername,
          newPreferredUsername: newUsername
        })

        console.log('Username changed to', newUsername)

        this.$store.dispatch('fetchUserInfos')

        setTimeout(() => this.$emit('done'), 300)
      } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        this.errorMessage = e.message
      }
      this.sending = false
    }
  }
}
</script>

<style>
</style>
