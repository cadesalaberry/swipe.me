<template>
  <div class="login-page">
    <form novalidate
          class="md-layout md-alignment-center-center"
          @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-25 md-medium-size-50 md-small-size-80 md-xsmall-size-90">
        <md-card-header>
          <div class="md-title">Fancy seeing you here!</div>
        </md-card-header>

        <md-card-content class="md-alignment-center-center"
                         v-if="!googleLoginEnabled">
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input type="email" name="email" id="email"
                      autocomplete="email"
                      v-model="emailValue"
                      :disabled="sending" />
            <span v-if="!$v.emailValue.required"
                  class="md-error">The email is required</span>
            <span v-else-if="!$v.emailValue.email"
                  class="md-error">Invalid email</span>
          </md-field>
          <md-field :class="{
            'md-invalid': errorMessage
          }">
            <label for="password">Password</label>
            <md-input type="password" name="password" id="password"
                      autocomplete="password"
                      v-model="passwordValue"
                      :disabled="sending" />
            <span v-if="errorMessage"
                  class="md-error">{{ errorMessage }}</span>
          </md-field>
        </md-card-content>

        <md-card-content class="md-alignment-center-center"
                         v-if="googleLoginEnabled">
          <md-button class="md-alignment-center-center" @click="loginWithGoogle">
            <md-icon :md-src="require('@/assets/google_g_logo.svg')" />
          </md-button>
        </md-card-content>

        <md-card-actions>
          <md-button type="submit"
                     v-if="!googleLoginEnabled"
                     class="md-primary"
                     :disabled="sending">Login</md-button>
        </md-card-actions>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
      </md-card>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

import GoogleGLogo from '@/assets/google_g_logo.svg'

export default {
  name: 'Home',
  data: () => ({
    googleLoginIcon: GoogleGLogo,
    googleLoginEnabled: true,
    emailValue: null,
    passwordValue: null,
    sending: false
  }),
  validations: {
    emailValue: {
      required,
      email
    },
    passwordValue: {
      required
    }
  },
  computed: {
    errorMessage () {
      const error = this.$store.getters.getAuthError
      return error && error.message
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v[`${fieldName}Value`]

      if (!field) return

      return {
        'md-invalid': field.$invalid && field.$dirty
      }
    },
    async loginWithGoogle () {
      this.sending = true

      await this.$store.dispatch('loginWithGoogle')

      this.sending = false
    },
    async loginUser () {
      this.sending = true

      await this.$store.dispatch('loginUser', {
        email: this.emailValue,
        password: this.passwordValue
      })
      this.sending = false

      if (!this.errorMessage) {
        this.$router.push(this.$route.query.redirect || '/')
      }
    },
    validateUser () {
      this.$v.$touch()

      if (this.$v.$invalid) return

      this.loginUser()
    }
  }
}

</script>

<style scoped>
.login-page {
  display: grid;
  height: 100%;
}
</style>
