<template>
  <div class="editable-deck">

    <div class="top-bar">
      <input
        class="deck-name"
        v-model="deck.deckHandle"
        v-on:keyup="saveDeckLocally"
        placeholder="Name of the deck">

      <button
        v-on:click="createDeck()"
        class="">Create</button>
    </div>
    <loader v-if="loading"></loader>

    <div
      v-for="(card, index) in deck.cards"
      :key="index"
      class="card"
    >
      <editable-card
        :key="index"
        :card="card"
        @onCardEdited="saveDeckLocally"
      />
    </div>

    <md-button href="#/decks/new"
               title="Add a card"
               class="md-fixed md-fab md-primary md-fab-bottom-right"
               v-on:click="addEmptyCard(deck)">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import EditableCard from './EditableCard.vue'
import Loader from './Loader.vue'

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
    return {
      loading: false,
      deck: {
        deckHandle: '',
        cards: []
      }
    }
  },

  mounted: function () {
    this.deck = JSON.parse(localStorage.getItem('decks/new')) || { cards: [] }

    if (!this.deck?.cards?.length) {
      this.addEmptyCard()
    }

    console.log('Loading deck from localStorage', this.deck)
  },

  methods: {
    createDeck () {
      this.loading = true
      const deckToCreate = {
        ...this.deck,
        deckId: this.deck.deckHandle,
        cards: this.deck.cards.filter(c => c.title)
      }
      console.log('Creating deck', deckToCreate)

      this.$http.post('decks', deckToCreate)
        .then((response) => {
          const newDeck = response.data

          console.log('Deck created', newDeck)

          this.deck = { cards: [] }

          this.saveDeckLocally()

          this.$router.push(`/decks/${newDeck.deckHandle}`)
        })
        .catch((err) => {
          this.error = true
          throw err
        })
        .finally(() => { this.loading = false })
    },

    saveDeckLocally () {
      const deckToSave = JSON.stringify(this.deck)

      console.log('Saving deck', deckToSave)

      localStorage.setItem('decks/new', deckToSave)
    },

    addEmptyCard () {
      if (this.deck.cards.length >= 9) {
        return alert('You cannot add more than 9 cards')
      }

      this.deck.cards.push({
        title: '',
        picture_path: 'https://images.unsplash.com/photo-1578666859768-10f9910a2045?auto=format&fit=crop&w=350&h=280&q=80',
        description: ''
      })

      console.log('Adding empty card')
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

/* Handle back button show/hide animations */
.slide-fade-enter-active {
  transition: all .2s ease-out;
}
.slide-fade-leave-active {
  transition: all .1s ease-in;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(40px);
  opacity: 0;
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
