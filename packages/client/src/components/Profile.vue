<template>
  <div class="profile-page">
    <div class="md-layout md-alignment-center-center">

      <md-card class="md-layout-item md-size-25 md-medium-size-50 md-small-size-80 md-xsmall-size-90">
        <md-card-header class="md-layout md-alignment-center-space-between">
          <md-content>{{ email }}</md-content>
          <md-avatar class="md-large">
            <editable-image v-model="pictureUrl" @input="onProfilePictureEdited"/>
          </md-avatar>
        </md-card-header>

        <md-divider></md-divider>

        <md-card-content>
          <md-field>
            <label for="firstName">First Name</label>
            <md-input type="firstName" name="firstName" id="firstName"
                      autocomplete="firstName"
                      :value="firstName"
                      @input="onFirstNameInput" />
          </md-field>

          <md-field>
            <label for="lastName">Last Name</label>
            <md-input type="lastName" name="lastName" id="lastName"
                      autocomplete="lastName"
                      :value="lastName"
                      @input="onLastNameInput" />
          </md-field>

          <md-field>
            <label for="username">Username</label>
            <md-input type="username" name="username" id="username"
                      autocomplete="username"
                      placeholder="Username not set"
                      :value="username"
                      disabled />
            <md-button class="md-icon-button" @click="shouldShowChangeUsernameDialog = true">
              <md-icon>edit</md-icon>
            </md-button>
          </md-field>

        </md-card-content>

        <md-card-actions>
          <md-menu>
            <md-button md-menu-trigger>
              <md-icon>weekend</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item @click="onLogoutUser">Logout</md-menu-item>
              <md-menu-item @click="onDeleteAccount">Delete account</md-menu-item>
            </md-menu-content>
          </md-menu>

          <md-button class="md-primary"
                     @click="onUpdateProfileInformations">Update</md-button>
        </md-card-actions>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />
      </md-card>
    </div>

    <md-dialog :md-active.sync="shouldShowChangeUsernameDialog">
      <change-username :username="username" @done="onChangedUsername">
      </change-username>
    </md-dialog>

    <md-dialog-confirm
      :md-active.sync="shouldShowAccountDeletionDialog"
      md-title="Oh no"
      md-content="All your decks will be deleted forever,
                  is that really what you want?
                  You will not be able to retreive that data, EVER.
                  <br><br>
                  But hey if you really want to go, that's life!"
      md-confirm-text="Delete my Account"
      md-cancel-text="Cancel"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" />
  </div>
</template>

<script>
import EditableImage from '@/components/EditableImage.vue'
import { required } from 'vuelidate/lib/validators'
import ChangeUsername from '@/components/ChangeUsername.vue'

export default {
  name: 'Profile',
  components: {
    ChangeUsername,
    EditableImage
  },
  data: () => ({
    shouldShowChangeUsernameDialog: false,
    shouldShowAccountDeletionDialog: false,
    pictureUrl: '',
    firstName: '',
    lastName: '',
    sending: false
  }),
  validations: {
    firstName: {
      required
    },
    lastName: {
      required
    }
  },
  mounted () {
    this.firstName = this.$store.getters.getFirstName
    this.lastName = this.$store.getters.getLastName
    this.pictureUrl = this.$store.getters.getProfilePicture
  },
  computed: {
    errorMessage () {
      const error = this.$store.getters.getAuthError
      return error && error.message
    },
    email () {
      return this.$store.getters.getUserEmail
    },
    username () {
      return this.$store.getters.getUsername
    }
  },
  methods: {
    async onLogoutUser () {
      return this.$store.dispatch('logoutUser')
        .then(() => this.$router.push('/'))
    },
    onProfilePictureEdited (url) {
      this.pictureUrl = url
    },
    onLastNameInput (lastName) {
      this.lastName = lastName
    },
    onFirstNameInput (firstName) {
      this.firstName = firstName
    },
    async onUpdateProfileInformations () {
      this.sending = true

      await this.$store.dispatch('updateUserInformations', {
        firstName: this.firstName,
        lastName: this.lastName,
        pictureUrl: this.pictureUrl
      })

      this.sending = false
    },
    onChangedUsername () {
      this.shouldShowChangeUsernameDialog = false
      this.username = this.$store.getters.getUsername
    },
    onDeleteAccount () {
      this.shouldShowAccountDeletionDialog = true
    },
    onCancel () {
      this.shouldShowAccountDeletionDialog = false
    },
    onConfirm () {
      this.shouldShowAccountDeletionDialog = false
    }
  }
}

</script>

<style scoped>
.profile-page {
  display: grid;
  height: 100%;
}
</style>
