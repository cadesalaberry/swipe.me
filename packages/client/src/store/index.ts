import Vue from 'vue'
import Vuex from 'vuex'
import * as Sentry from '@sentry/browser'
import VuexPersistence from 'vuex-persist'

import { AmplifyConfig, EnvHelper } from '@swipeme.io/common/environment'
import type { User, Deck } from '@swipeme.io/common/types'

import Amplify, { API } from 'aws-amplify'
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

const getDefaultState = () => ({
  auth: {
    error: null,
    isAuthenticated: false,
    cognitoUsername: null,
    infos: null
  },
  globalError: null,
  currentDeck: null,
  isLoadingDeck: false,
  isLoadingDecks: false,
  loadingDeckError: null,
  deckList: [],
  newDeck: {
    title: '',
    deckHandle: '',
    cards: []
  },
  newDeckError: null
})

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: getDefaultState(),
  getters: {
    isAuthenticated (state) {
      return state.auth.isAuthenticated
    },
    getAuthError (state) {
      return state.auth.error
    },
    getUserEmail (state) {
      const infos = state.auth.infos as unknown as User
      return infos?.email
    },
    getProfilePicture (state) {
      const infos = state.auth.infos as unknown as User
      return infos?.picture
    },
    getFirstName (state) {
      const infos = state.auth.infos as unknown as User
      return infos?.given_name
    },
    getLastName (state) {
      const infos = state.auth.infos as unknown as User
      return infos?.family_name
    },
    getUsername (state) {
      const infos = state.auth.infos as unknown as User
      return infos?.preferred_username
    },
    getCognitoUsername (state) {
      return state.auth.cognitoUsername
    },
    getLoadingDeckError (state) {
      return state.loadingDeckError
    },
    getLoadingDeckStatus (state) {
      return state.isLoadingDeck
    },
    getLoadingDecksStatus (state) {
      return state.isLoadingDecks
    },
    getGlobalError (state) {
      return state.globalError
    },
    getDeckList (state) {
      return state.deckList
    }
  },
  mutations: {
    setCognitoUsername (state, username) {
      state.auth.cognitoUsername = username
    },
    setUserInfos (state, infos) {
      state.auth.infos = infos
      state.auth.isAuthenticated = !!infos
    },
    setAuthError (state, error) {
      state.auth.error = error

      if (error) state.auth.isAuthenticated = false
    },
    setGlobalError (state, globalError) {
      state.globalError = globalError
    },
    setCurrentDeck (state, currentDeck) {
      state.currentDeck = currentDeck
    },
    setDeckList (state, deckList) {
      state.deckList = deckList
    },
    setLoadingDeckStatus (state, status: boolean) {
      state.isLoadingDeck = status
    },
    setLoadingDecksStatus (state, status: boolean) {
      state.isLoadingDecks = status
    },
    setLoadingDeckError (state, error) {
      state.loadingDeckError = error
    },
    setNewDeck (state, deck) {
      state.newDeck = deck
    },
    resetNewDeck (state) {
      state.newDeck = {
        title: '',
        deckHandle: '',
        cards: []
      }
    },
    setNewDeckError (state, error) {
      state.newDeckError = error
    },
    resetState (state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    async loginUser ({ commit }, { email, password }) {
      try {
        const infos = await Auth.signIn(email, password)
        console.log('infos', infos)
        commit('setUserInfos', infos.attributes)
        commit('setCognitoUsername', infos.username)
        commit('setAuthError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async updateUserInformations ({ commit }, attributes) {
      const { firstName, lastName, pictureUrl } = attributes
      const cognitoAttributes = {
        ...firstName ? { given_name: attributes.firstName } : {},
        ...lastName ? { family_name: attributes.lastName } : {},
        ...pictureUrl ? { picture: attributes.pictureUrl } : {}
      }
      try {
        const user = await Auth.currentAuthenticatedUser()
        const status = await Auth.updateUserAttributes(user, cognitoAttributes)

        if (status !== 'SUCCESS') throw new Error('Could not update the user attributes')

        const updatedUser = await Auth.currentAuthenticatedUser()
        const updatedAttributes = updatedUser.attributes
        const username = updatedUser.username

        console.log(updatedUser)
        commit('setUserInfos', updatedAttributes)
        commit('setCognitoUsername', username)
        commit('setAuthError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async loginWithGoogle ({ commit, dispatch }) {
      try {
        const provider = CognitoHostedUIIdentityProvider.Google
        const socialResult = await Auth.federatedSignIn({
          provider: provider
        })
        console.log('google Result:', socialResult)

        dispatch('fetchUserInfos')

        // commit('setUserInfos', infos.attributes)
        // commit('setAuthError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async createUser ({ commit }, { email, password }) {
      try {
        const signupResult = await Auth.signUp({
          username: email,
          password
        })
        const attributes = await Auth.userAttributes(signupResult.user)

        commit('setUserInfos', attributes)
        commit('setAuthError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async fetchDeckByHandle ({ commit }, { userHandle, deckHandle }) {
      commit('setLoadingDeckStatus', true)

      try {
        const response = await API.get('main', `decks/${userHandle}/${deckHandle}`, {})

        commit('setCurrentDeck', response)
        commit('setLoadingDeckError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setCurrentDeck', null)
        commit('setLoadingDeckError', e)
      }

      commit('setLoadingDeckStatus', false)
    },
    async fetchAllDecksByOwnerHandle ({ commit }, ownerHandle: string) {
      commit('setLoadingDecksStatus', true)

      try {
        const response = await API.get('main', 'decks', {
          queryStringParameters: { ownerHandle }
        })

        commit('setDeckList', response)
        commit('setLoadingDeckError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setDeckList', [])
        commit('setLoadingDeckError', e)
      }

      commit('setLoadingDecksStatus', false)
    },
    async createDeck ({ commit }, deck: Deck) {
      commit('setLoadingDeckStatus', true)

      const deckToCreate = {
        ...deck,
        cards: deck.cards.filter(c => c.title || c.description)
      }
      let deckHandle = null

      try {
        const createdDeck = await API.post('main', 'decks', { body: deckToCreate })

        commit('setNewDeck', createdDeck)
        commit('setNewDeckError', null)

        deckHandle = createdDeck.deckHandle
      } catch (e) {
        Sentry.captureException(e)
        commit('setNewDeckError', e)
      }

      commit('setLoadingDeckStatus', false)

      return deckHandle
    },
    async changePreferredUsername (_, { username, newPreferredUsername }) {
      console.log('changePreferredUsername')
      return API.post('main', 'users/username', { body: { username, newPreferredUsername } })
    },
    async syncServerConfig ({ commit, dispatch }) {
      try {
        const serverConfig = await API.get('main', 'config.json', {})
        const amplifyConfig = EnvHelper.getAmplifyConfigFromServerConfig(serverConfig)

        dispatch('configureAmplify', amplifyConfig)
        commit('setGlobalError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setGlobalError', e.message)
      }
    },
    configureAmplify ({ commit }, config: AmplifyConfig) {
      try {
        Amplify.configure(config)
        commit('setGlobalError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setGlobalError', e.message)
      }
    },
    async fetchUserInfos ({ commit }) {
      try {
        const infos = await Auth.currentUserInfo()

        // if the user is not logged in we don't have any info
        if (!infos) return

        commit('setUserInfos', infos.attributes)
        commit('setAuthError', null)
      } catch (e) {
        Sentry.captureException(e)
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async logoutUser ({ commit }) {
      try {
        await Auth.signOut()
        commit('resetState')
      } catch (e) {
        Sentry.captureException(e)
        commit('setAuthError', e)
      }
    }
  }
})
