import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

// eslint-disable-next-line no-unused-vars
import type { IUserInformations, IDeck } from './types'

import Amplify, { Auth, API } from 'aws-amplify'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: {
    amplifyConfig: null,
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
    getAuthError (state) {
      return state.auth.error
    },
    getUserEmail (state) {
      const infos = state.auth.infos as unknown as IUserInformations
      return infos && infos.attributes.email
    },
    getLoadingDeckError (state) {
      return state.loadingDeckError
    },
    getLoadingDeckStatus (state) {
      return state.isLoadingDeck
    },
    getGlobalError (state) {
      return state.globalError
    },
    getAmplifyConfig (state) {
      return state.amplifyConfig
    }
  },
  mutations: {
    setUserInfos (state, infos) {
      state.auth.infos = infos
      state.auth.isAuthenticated = !!infos
    },
    setAuthError (state, error) {
      state.auth.error = error
      state.auth.isAuthenticated = false
    },
    setGlobalError (state, globalError) {
      state.globalError = globalError
    },
    setAmplifyConfig (state, amplifyConfig) {
      state.amplifyConfig = amplifyConfig
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
        commit('setUserInfos', infos)
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
      } catch (e) {
        commit('setCurrentDeck', null)
        commit('setLoadingDeckError', e)
      }

      commit('setLoadingDeckStatus', false)
    },
    async createDeck ({ commit }, deck: IDeck) {
      commit('setLoadingDeckStatus', true)

      const deckToCreate = {
        ...deck,
        cards: deck.cards.filter(c => c.title || c.description)
      }
      let deckHandle = null

      try {
        const createdDeck = await API.post('main', 'decks', { body: deckToCreate })

        commit('setNewDeck', createdDeck)

        deckHandle = createdDeck.deckHandle
      } catch (e) {
        commit('setNewDeckError', e)
      }

      commit('setLoadingDeckStatus', false)

      return deckHandle
    },
    async syncServerConfig ({ commit, dispatch, getters }) {
      try {
        const {
          region,
          cognitoUserPoolId: userPoolId,
          cognitoIdentityPoolId: identityPoolId,
          cognitoUserPoolClientId: userPoolWebClientId
        } = await API.get('main', 'config.json', {})

        const config = getters.getAmplifyConfig

        const newConfig = {
          ...config,
          Auth: {
            ...config.Auth ? config.Auth : {},
            mandatorySignIn: true,
            userPoolWebClientId,
            identityPoolId,
            userPoolId,
            region
          },
          Storage: {
            ...config.Storage ? config.Storage : {},
            bucket: process.env.VUE_APP_S3_UPLOADS_BUCKET_NAME,
            identityPoolId,
            region
          }
        }
        commit('setAmplifyConfig', newConfig)
        dispatch('configureAmplify', newConfig)
      } catch (e) {
        commit('setGlobalError', e.message)
      }
    },
    configureAmplify ({ commit }, config) {
      try {
        Amplify.configure(config)
        commit('setAmplifyConfig', config)
      } catch (e) {
        commit('setGlobalError', e.message)
      }
    },
    async fetchUserInfos ({ commit }) {
      try {
        const infos = await Auth.currentUserInfo()
        commit('setUserInfos', infos)
      } catch (e) {
        commit('setUserInfos', null)
        commit('setAuthError', e)
      }
    },
    async logoutUser ({ commit }) {
      try {
        await Auth.signOut()
        commit('setUserInfos', null)
      } catch (e) {
        commit('setAuthError', e)
      }
    }
  }
})
