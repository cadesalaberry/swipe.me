<template>
  <div class="home">

    <md-empty-state
      v-if="!isAuthenticated"
      md-icon="accessible_forward"
      md-label="Work in progress..."
      md-description="You probably want to checkout the demo deck meanwhile.">
      <md-button href="#/decks/banana" class="md-primary md-raised">Demo deck</md-button>
    </md-empty-state>

    <loader v-if="loading"></loader>

    <md-empty-state
      v-else-if="!decks.length"
      md-icon="accessibility_new"
      md-label="Time to get creative"
      md-description="You should go ahead and create your first deck">
      <md-button href="#/decks/new" class="md-primary md-raised">Create my first deck</md-button>
    </md-empty-state>

    <ul v-if="decks.length">
      <li v-for="deck in decks" :key="deck.deckHandle">
      <router-link :to="'decks/' + deck.deckHandle">
        <deck-summary
          :imageURL="deck.cards[0].picturePath"
          :description="deck.cards[0].description"
          :title="deck.deckHandle">
          </deck-summary>
      </router-link>
      </li>
    </ul>

    <md-button v-if="isAuthenticated && decks.length" href="#/decks/new" class="md-fixed md-fab md-fab-bottom-right">
        <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import DeckSummary from '@/components/DeckSummary.vue'

export default {
  name: 'Home',
  components: {
    DeckSummary,
    Loader
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    loading () {
      return this.$store.getters.getLoadingDecksStatus
    },
    decks () {
      return this.$store.getters.getDeckList
    }
  },
  mounted () {
    // const deckId = this.$route.params.deckId
    this.$store.dispatch('fetchAllDecksByOwnerHandle', '')
  }
}
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  position: relative;
  overflow-y: scroll;
}
.center-title {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 300px;
  height: 100%;
  margin: 0 auto;
}
.cta {
  margin-top: 10px;
}
.btn-add {
  position: absolute;
  bottom: 32px;
  right: 32px;
}
.icon--plus {
  width: 64px;
  height: 64px;
  opacity: .7;
}
ul {
  list-style-type: none;
  padding-left: 0;
  margin-left: auto;
  margin-right: auto;
}
li {
  width: 90vw;
  margin-bottom: 12px;
  height: calc(90vw*0.618); /* keep the golden ration for the card */
}
li a:hover {
  text-decoration: none;
}
</style>
