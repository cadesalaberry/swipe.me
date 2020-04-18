import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { Auth } from 'aws-amplify'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

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

interface ICards {
  title: string;
  description: string;
  // eslint-disable-next-line camelcase
  picture_path: string;
}
interface IDeck {
  deckHandle: string;
  deckId: string;
  cards: Array<ICards>;
}

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: {
    auth: {
      error: null,
      isAuthenticated: false,
      infos: null
    },
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
    async createDeck ({ commit }, deck: IDeck) {
      commit('setLoadingDeckStatus', true)

      const deckToCreate = {
        ...deck,
        deckId: deck.deckHandle,
        cards: deck.cards.filter(c => c.title || c.description)
      }
      let deckHandle = null

      try {
        // const deck = await API.post('main', `/decks`, deckToCreate)
        const response = await Vue.prototype.$http.post('/decks', deckToCreate)

        console.log(response)
        commit('setNewDeck', response.data)

        deckHandle = response.data.deckHandle
      } catch (e) {
        commit('setNewDeckError', e)
      }

      commit('setLoadingDeckStatus', false)

      return deckHandle
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
