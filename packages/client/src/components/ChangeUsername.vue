<template>
  <md-card-content>
    <form novalidate class="md-layout" @submit.prevent="changeUsername">
      <md-dialog-title>Pick your username</md-dialog-title>
      <md-field>
        <label for="username">Username</label>
        <md-input type="username" name="username" id="username"
                  autocomplete="username"
                  v-model="username" />
      </md-field>
      <md-dialog-actions>
        <md-button class="md-primary" @click="changeUsername">Save</md-button>
      </md-dialog-actions>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </form>
  </md-card-content>
</template>

<script>
export default {
  name: 'ChangeUsername',
  data () {
    return {
      username: '',
      sending: false
    }
  },
  methods: {
    changeUsername () {
      console.log('Hello', this.username)

      setTimeout(() => this.$emit('done', this.username), 300)
    }
  }
}
</script>

<style>
</style>
