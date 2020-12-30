<template>
  <div class="editable-deck">

    <div class="top-bar">
      <input
        class="deck-name"
        v-model="deck.title"
        @keyup="saveDeckLocally"
        placeholder="Name of the deck">

      <button
        @click="createDeck()"
        class="">Create</button>
    </div>
    <loader v-if="loading"></loader>

    <div
      v-for="(card, index) in deck.cards"
      :key="index"
      class="card md-elevation-1"
    >
      <editable-card
        :uniqueId="'card-' + index"
        :card="card"
        @onCardEdited="saveDeckLocally"
      />
    </div>

    <md-button href="#/decks/new"
               v-if="canAddCard"
               title="Add a card"
               class="md-fixed md-fab md-primary md-fab-bottom-right"
               @click="addEmptyCard(deck)">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import Namer from '@swipeme.io/common/namer'
import EditableCard from '@/components/EditableCard.vue'
import Loader from '@/components/Loader.vue'

const MAX_CARD_COUNT = 9

export default {
  name: 'EditableDeck',
  props: {
    subtitle: String
  },
  components: {
    EditableCard,
    Loader
  },

  data () {
    return {}
  },

  computed: {
    loading () {
      return this.$store.getters.getLoadingDeckStatus
    },
    deck () {
      return this.$store.state.newDeck
    },
    tooManyCards () {
      return this.deck.cards.length >= MAX_CARD_COUNT
    },
    lastCardIsEmpty () {
      const lastCard = this.deck.cards[this.deck.cards.length - 1]

      return lastCard && !lastCard.title && !lastCard.description
    },
    canAddCard () {
      return !this.tooManyCards && !this.lastCardEmpty
    }
  },

  mounted: function () {
    if (!this.deck?.cards?.length) {
      this.addEmptyCard()
    }

    this.saveDeckLocally()
  },

  methods: {
    createDeck () {
      const { deck } = this
      const deckHandle = deck.deckHandle || Namer.sanitize(deck)
      const deckToCreate = {
        ...deck,
        deckHandle
      }

      this.$store
        .dispatch('createDeck', deckToCreate)
        .then((newDeckHandle) => {
          // An error must have occured
          if (!newDeckHandle) return

          this.$router.push(`/decks/${newDeckHandle}`)
          this.$store.commit('resetNewDeck')
        })
    },

    saveDeckLocally () {
      this.$store.commit('setNewDeck', this.deck)
    },

    addEmptyCard () {
      if (this.tooManyCards) {
        return alert(`You cannot add more than ${MAX_CARD_COUNT} cards`)
      }

      if (this.lastCardIsEmpty) {
        return alert('The last card is already empty')
      }

      this.deck.cards.push({
        title: '',
        picturePath: 'https://images.unsplash.com/photo-1578666859768-10f9910a2045?auto=format&fit=crop&w=350&h=280&q=80',
        description: ''
      })

      this.saveDeckLocally()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editable-deck {
  display: grid;
  justify-items: center;
  grid-gap: 16px;
  padding-bottom: 32px;
  padding-top: 32px;
}
.top-bar {
  display: flex;
}
.deck-name {
  font-size: 1.5rem;
  width: 100%;
  padding: 0 10px;
}
a {
  color: #42b983;
}

input {
  border:none;
  background-image:none;
  background-color:transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
