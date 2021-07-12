<template>
  <div class="editable-deck">

    <div class="top-bar">
      <input
        class="deck-name"
        :disabled="editionModeEnabled"
        v-model="deck.title"
        @keyup="() => saveDeckLocally(deck)"
        placeholder="Name of the deck">
    </div>
    <loader v-if="loading"></loader>

    <div
      v-for="(card, index) in deck.cards"
      :key="index + '-' + card.title"
      class="card-action-bar-container"
    >
      <span class="card-action-bar">
        <md-button title="Remove this card"
               class="md-icon-button md-dense"
               @click="removeCard(index)">
          <md-icon>delete</md-icon>
        </md-button>
      </span>
      <div class="card md-elevation-1">
        <editable-card
          :card="card"
          @onCardEdited="(newCard) => onCardEdition(index, newCard)"
        />
      </div>
    </div>

    <div
      v-if="canAddCard"
      @click="addEmptyCard(deck)"
      class="card md-elevation-1"
    >
      <md-icon class="md-size-5x new-card-icon">add</md-icon>
    </div>

    <md-button title="Save deck"
               class="md-fixed md-fab md-primary md-fab-bottom-right"
               @click="createDeck()">
      <md-icon>save</md-icon>
    </md-button>

  </div>
</template>

<script>
import { Namer } from '@swipeme.io/common'
import EditableCard from '@/components/EditableCard.vue'
import Loader from '@/components/Loader.vue'

const MAX_CARD_COUNT = 9

export default {
  name: 'EditableDeck',
  props: {
    editionModeEnabled: Boolean
  },
  components: {
    EditableCard,
    Loader
  },

  computed: {
    loading () {
      return this.$store.getters.getLoadingDeckStatus
    },
    deck () {
      const { editionModeEnabled } = this

      return editionModeEnabled
        ? this.$store.state.existingDeck
        : this.$store.state.newDeck
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
    },
    currentUserHandle () {
      return this.$store.getters.getCurrentUserHandle
    }
  },

  mounted: function () {
    const { editionModeEnabled, deck } = this
    const { deckHandle, userHandle } = this.$route.params

    console.log(this.$route.params, editionModeEnabled)
    if (editionModeEnabled) {
      this.$store
        .dispatch('fetchDeckByHandle', { userHandle, deckHandle })
        .then((existingDeck) => {
          if (!existingDeck) return
          this.$store.commit('setExistingDeck', existingDeck)
        })
    }

    if (!deck?.cards?.length) {
      this.addEmptyCard()
    }

    this.saveDeckLocally(deck)
  },

  methods: {
    createDeck () {
      const { deck, currentUserHandle, editionModeEnabled } = this

      const deckHandle = deck.deckHandle || Namer.sanitizeHandle(deck.title)
      const deckToCreate = {
        ...deck,
        ownerHandle: currentUserHandle,
        deckHandle
      }

      const promiseToSaveDeck = editionModeEnabled
        ? this.$store.dispatch('updateDeck', deckToCreate)
        : this.$store.dispatch('createDeck', deckToCreate)

      return promiseToSaveDeck
        .then((newDeckHandle) => {
          // An error must have occured
          if (!newDeckHandle) return

          this.$router.push(`/${currentUserHandle}/${newDeckHandle}`)

          this.resetDeck()
        })
    },

    removeCard (index) {
      this.deck.cards.splice(index, 1)
    },

    onCardEdition (index, card) {
      const { cards } = this.deck

      cards[index] = card

      const newDeck = {
        ...this.deck,
        cards
      }
      console.log(newDeck.cards[index])
      this.saveDeckLocally(newDeck)
    },

    saveDeckLocally (deck) {
      const { editionModeEnabled } = this

      if (editionModeEnabled) return this.$store.commit('setExistingDeck', deck)

      this.$store.commit('setNewDeck', deck)
    },

    resetDeck () {
      const { editionModeEnabled } = this

      if (editionModeEnabled) return this.$store.commit('resetExistingDeck')

      this.$store.commit('resetNewDeck')
    },

    addEmptyCard () {
      const { deck } = this

      if (this.tooManyCards) {
        return alert(`You cannot add more than ${MAX_CARD_COUNT} cards`)
      }

      if (this.lastCardIsEmpty) {
        return alert('The last card is already empty')
      }

      deck.cards.push({
        title: '',
        picturePath: 'https://images.unsplash.com/photo-1578666859768-10f9910a2045?auto=format&fit=crop&w=350&h=280&q=80',
        description: ''
      })

      this.saveDeckLocally(deck)
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
.card-action-bar {
  background-color: darkgrey;
  /* padding: 5px; */
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-top: 12px;
  float: right;
}
.new-card-icon {
  height: 100%;
  width: 100%;
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
