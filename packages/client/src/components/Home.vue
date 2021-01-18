<template>
  <div class="home">

    <loader v-if="loading"></loader>

    <md-empty-state
      v-else-if="!isAuthenticated"
      md-icon="accessible_forward"
      md-label="Work in progress..."
      md-description="You probably want to checkout the demo deck meanwhile.">
      <md-button href="cadesalaberry/banana" class="md-primary md-raised">Demo deck</md-button>
    </md-empty-state>

    <md-empty-state
      v-else-if="isMe && isAuthenticated && !decks.length"
      md-icon="accessibility_new"
      md-label="Time to get creative"
      md-description="You should go ahead and create your first deck">
      <md-button href="decks/new" class="md-primary md-raised">Create my first deck</md-button>
    </md-empty-state>

    <md-empty-state
      v-else-if="!isMe && isAuthenticated && !decks.length"
      md-icon="production_quantity_limits"
      md-label="There is just emptiness"
      md-description="This user seems to want to keep his stuff for himself">
      <md-button href="/" class="md-primary md-raised">Go home</md-button>
    </md-empty-state>

    <ul v-else-if="isAuthenticated && decks.length" class="main-content">
      <div class="intro-text">Have a look at the decks already on the platform</div>
      <li v-for="deck in decks" :key="deck.deckHandle">
      <router-link :to="deck.ownerHandle + '/' + deck.deckHandle">
        <deck-summary
          :imageURL="deck.cards[0].picturePath"
          :description="deck.cards[0].description"
          :title="deck.title">
          </deck-summary>
      </router-link>
      </li>
    </ul>

    <md-button v-if="isAuthenticated && decks.length" href="decks/new" class="md-fixed md-fab md-fab-bottom-right">
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
    currentUserHandle () {
      return this.$store.getters.getCurrentUserHandle
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    isMe () {
      const { userHandle } = this.$route.params
      const { currentUserHandle } = this
      return userHandle === currentUserHandle || !userHandle
    },
    loading () {
      return this.$store.getters.getLoadingDecksStatus
    },
    decks () {
      return this.$store.getters.getDeckList
    }
  },
  mounted () {
    const { userHandle } = this.$route.params
    const { currentUserHandle } = this
    const handle = userHandle || currentUserHandle

    if (!this.isAuthenticated) return

    this.$store.dispatch('fetchAllDecksByOwnerHandle', handle)
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
.intro-text {
  font-size: 3rem;
  line-height: 4rem;
  margin-bottom: 30px;
  padding: 6px;
}
.main-content {
  max-width: 512px;
  padding: 6px;
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
  width: 308px;
  margin-bottom: 12px;
  margin-left: auto;
  margin-right: auto;
  height: calc(308px*0.618); /* keep the golden ration for the card */
}
li a:hover {
  text-decoration: none;
}

@media all and (min-width: 424px) {
  li {
    width: 412px;
    height: calc(412px*0.618); /* keep the golden ration for the card */
  }
}
@media all and (min-width: 524px) {
  li {
    width: 512px;
    height: calc(512px*0.618); /* keep the golden ration for the card */
  }
}
</style>
