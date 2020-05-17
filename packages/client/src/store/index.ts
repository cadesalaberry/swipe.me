import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import type { User, Deck } from '@swipeme.io/common/types'

import Amplify, { API } from 'aws-amplify'
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'
import { EnvHelper } from 'helpers/environment'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: {
    auth: {
      error: null,
      isAuthenticated: false,
      infos: null
    },
    globalError: null,
    currentDeck: null,
    isLoadingDeck: false,
    loadingDeckError: null,
    newDeck: {
      deckHandle: '',
      cards: []
    },
    newDeckError: null
  },
  getters: {
    isAuthenticated (state) {
      return state.auth.isAuthenticated
    },
    isLocal () {
      const hostname = window.location.hostname
      return hostname === 'localhost'
    },
    getAuthError (state) {
      return state.auth.error
    },
    getUserEmail (state) {
      const infos = state.auth.infos as unknown as User
      return infos && infos.email
    },
    getProfilePicture (state) {
      const infos = state.auth.infos as unknown as User
      return infos && infos.picture
    },
    getFirstName (state) {
      const infos = state.auth.infos as unknown as User
      return infos && infos.given_name
    },
    getLastName (state) {
      const infos = state.auth.infos as unknown as User
      return infos && infos.family_name
    },
    getLoadingDeckError (state) {
      return state.loadingDeckError
    },
    getLoadingDeckStatus (state) {
      return state.isLoadingDeck
    },
    getGlobalError (state) {
      return state.globalError
    }
  },
  mutations: {
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
    setLoadingDeckStatus (state, status: boolean) {
      state.isLoadingDeck = status
    },
    setLoadingDeckError (state, error) {
      state.loadingDeckError = error
    },
    setNewDeck (state, deck) {
      state.newDeck = deck
    },
    resetNewDeck (state) {
      state.newDeck = {
        deckHandle: '',
        cards: []
      }
    },
    setNewDeckError (state, error) {
      state.newDeckError = error
    }
  },
  actions: {
    async loginUser ({ commit }, { email, password }) {
      try {
        const infos = await Auth.signIn(email, password)
        commit('setUserInfos', infos.attributes)
        commit('setAuthError', null)
      } catch (e) {
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

        console.log(updatedAttributes)
        commit('setUserInfos', updatedAttributes)
        commit('setAuthError', null)
      } catch (e) {
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
        console.log(e)
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
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async fetchDeckByHandle ({ commit }, deckHandle: string) {
      commit('setLoadingDeckStatus', true)

      try {
        const response = await API.get('main', `decks/${deckHandle}`, {})

        commit('setCurrentDeck', response)
        commit('setLoadingDeckError', null)
      } catch (e) {
        commit('setCurrentDeck', null)
        commit('setLoadingDeckError', e)
      }

      commit('setLoadingDeckStatus', false)
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
        commit('setNewDeckError', e)
      }

      commit('setLoadingDeckStatus', false)

      return deckHandle
    },
    async syncServerConfig ({ commit, dispatch }) {
      try {
        const serverConfig = await API.get('main', 'config.json', {})
        const amplifyConfig = EnvHelper.getAmplifyConfigFromServerConfig(serverConfig)

        dispatch('configureAmplify', amplifyConfig)
        commit('setGlobalError', null)
      } catch (e) {
        commit('setGlobalError', e.message)
      }
    },
    configureAmplify ({ commit }, config) {
      try {
        Amplify.configure(config)
        commit('setGlobalError', null)
      } catch (e) {
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
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async logoutUser ({ commit }) {
      try {
        await Auth.signOut()
        commit('setUserInfos', null)
        commit('setAuthError', null)
      } catch (e) {
        commit('setAuthError', e)
      }
    }
  }
})
