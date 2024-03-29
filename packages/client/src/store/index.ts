import Vue from 'vue'
import Vuex from 'vuex'
import * as Sentry from '@sentry/browser'
import VuexPersistence from 'vuex-persist'

import { AmplifyConfig, Card, EnvHelper } from '@swipeme.io/common'
import type { User, Deck } from '@swipeme.io/common'

import Amplify, { API } from 'aws-amplify'
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

interface GlobalState {
  auth: {
    error: Error | null;
    isAuthenticated: boolean,
    cognitoUsername: string,
    infos: User | null
  },
  globalError: Error | null,
  currentDeck: Deck | null,
  isLoadingDeck: boolean,
  isLoadingDecks: boolean,
  loadingDeckError: Error | null,
  deckList: Deck[],
  newDeck: {
    title: string,
    deckHandle: string,
    cards: Card[]
  },
  existingDeck: {
    title: string,
    deckHandle: string,
    cards: Card[]
  },
  newDeckError: Error | null
}

const getDefaultState = (): GlobalState => ({
  auth: {
    error: null,
    isAuthenticated: false,
    cognitoUsername: '',
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
  existingDeck: {
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
    isAuthenticated (state: GlobalState) {
      return state.auth.isAuthenticated
    },
    getAuthError (state: GlobalState) {
      return state.auth.error
    },
    getUserEmail (state: GlobalState): string {
      const infos = state.auth.infos
      return infos?.email ?? ''
    },
    getProfilePicture (state: GlobalState): string {
      const infos = state.auth.infos
      return infos?.picture ?? ''
    },
    getFirstName (state: GlobalState): string {
      const infos = state.auth.infos
      return infos?.given_name ?? ''
    },
    getLastName (state: GlobalState): string {
      const infos = state.auth.infos
      return infos?.family_name ?? ''
    },
    getCurrentUserHandle (state: GlobalState): string {
      const infos = state.auth.infos
      return infos?.preferred_username ?? ''
    },
    getCognitoUsername (state: GlobalState): string {
      return state.auth.cognitoUsername
    },
    getLoadingDeckError (state: GlobalState) {
      return state.loadingDeckError
    },
    getLoadingDeckStatus (state: GlobalState): boolean {
      return state.isLoadingDeck
    },
    getLoadingDecksStatus (state: GlobalState): boolean {
      return state.isLoadingDecks
    },
    getGlobalError (state: GlobalState) {
      return state.globalError
    },
    getDeckList (state: GlobalState): Deck[] {
      return state.deckList
    }
  },
  mutations: {
    setCognitoUsername (state: GlobalState, username: string): void {
      state.auth.cognitoUsername = username
    },
    setUserInfos (state: GlobalState, infos: User): void {
      state.auth.infos = infos
      state.auth.isAuthenticated = !!infos
    },
    setAuthError (state: GlobalState, error: Error | null): void {
      state.auth.error = error

      if (error) state.auth.isAuthenticated = false
    },
    setGlobalError (state: GlobalState, globalError: Error | null): void {
      state.globalError = globalError
    },
    setCurrentDeck (state: GlobalState, currentDeck: Deck): void {
      state.currentDeck = currentDeck
    },
    setDeckList (state: GlobalState, deckList: Deck[]): void {
      state.deckList = deckList
    },
    setLoadingDeckStatus (state: GlobalState, status: boolean): void {
      state.isLoadingDeck = status
    },
    setLoadingDecksStatus (state: GlobalState, status: boolean): void {
      state.isLoadingDecks = status
    },
    setLoadingDeckError (state: GlobalState, error: Error): void {
      state.loadingDeckError = error
    },
    setNewDeck (state: GlobalState, deck: Deck): void {
      state.newDeck = deck
    },
    setExistingDeck (state: GlobalState, deck: Deck): void {
      state.existingDeck = deck
    },
    resetNewDeck (state: GlobalState): void {
      state.newDeck = {
        title: '',
        deckHandle: '',
        cards: []
      }
    },
    resetExistingDeck (state: GlobalState): void {
      state.existingDeck = {
        title: '',
        deckHandle: '',
        cards: []
      }
    },
    setNewDeckError (state: GlobalState, error: Error | null): void {
      state.newDeckError = error
    },
    resetState (state: GlobalState): void {
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
      let deck = null
      try {
        const response = await API.get('main', `decks/${userHandle}/${deckHandle}`, {})

        commit('setCurrentDeck', response)
        commit('setLoadingDeckError', null)
        deck = response
      } catch (e) {
        Sentry.captureException(e)
        commit('setCurrentDeck', null)
        commit('setLoadingDeckError', e)
      }

      commit('setLoadingDeckStatus', false)

      return deck
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
    async updateDeck ({ commit }, deck: Deck) {
      commit('setLoadingDeckStatus', true)

      const { deckHandle, ownerHandle } = deck
      const deckToCreate = {
        ...deck,
        cards: deck.cards.filter(c => c.title || c.description)
      }
      const deckUrl = `decks/${ownerHandle}/${deckHandle}`

      try {
        const updatedDeck = await API.post('main', deckUrl, { body: deckToCreate })

        commit('setNewDeck', updatedDeck)
        commit('setNewDeckError', null)
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
        if (e instanceof Error) { commit('setGlobalError', e.message) }
      }
    },
    configureAmplify ({ commit }, config: AmplifyConfig) {
      try {
        Amplify.configure(config)
        commit('setGlobalError', null)
      } catch (e) {
        Sentry.captureException(e)
        if (e instanceof Error) { commit('setGlobalError', e.message) }
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
