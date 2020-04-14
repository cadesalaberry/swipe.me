import Vue from 'vue'
import Vuex from 'vuex'
import { Auth } from 'aws-amplify'

Vue.use(Vuex)

interface IUserAttributes {
  email: string;
  // eslint-disable-next-line camelcase
  email_verified: string;
  sub: string;
}

interface IUserInformations {
  attributes: IUserAttributes
}

export default new Vuex.Store({
  state: {
    auth: {
      error: null,
      isAuthenticated: false,
      infos: null
    },
    currentDeck: null,
    isLoadingDeck: false,
    loadingDeckError: null
  },
  getters: {
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
    setCurrentDeck (state, currentDeck) {
      state.currentDeck = currentDeck
    },
    setLoadingDeckStatus (state, status: boolean) {
      state.isLoadingDeck = status
    },
    setLoadingDeckError (state, error) {
      state.loadingDeckError = error
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
        // const deck = await API.get('main', `/decks/${deckHandle}`, {})
        const response = await Vue.prototype.$http.get(`/decks/${deckHandle}`, {})

        console.log(response)
        commit('setCurrentDeck', response.data)
      } catch (e) {
        commit('setCurrentDeck', null)
        commit('setLoadingDeckError', e)
      }

      commit('setLoadingDeckStatus', false)
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
