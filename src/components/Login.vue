<template>
  <div class="login-page">
    <form novalidate
          class="md-layout md-alignment-center-center"
          @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-25 md-medium-size-50 md-small-size-80 md-xsmall-size-90">
        <md-card-header>
          <div class="md-title">Fancy seeing you here!</div>
        </md-card-header>

        <md-card-content>
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

        <md-card-actions>
          <md-button type="submit"
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
import { Auth } from 'aws-amplify'

export default {
  name: 'Home',
  data: () => ({
    emailValue: null,
    passwordValue: null,
    sending: false,
    errorMessage: ''
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
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v[`${fieldName}Value`]

      if (!field) return

      return {
        'md-invalid': field.$invalid && field.$dirty
      }
    },
    async saveUser () {
      this.sending = true

      try {
        await Auth.signIn(this.emailValue, this.passwordValue)
      } catch (e) {
        this.errorMessage = e.message
        console.log('Error loging in', e)
      }
      this.sending = false
    },
    validateUser () {
      this.$v.$touch()

      if (this.$v.$invalid) return

      this.saveUser()
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
