<template>
  <div class="editable-deck">

    <div class="top-bar">
      <input
        class="deck-name"
        v-model="deck.deckHandle"
        v-on:keyup="saveDeckLocally"
        placeholder="Name of the deck">

      <!-- <button
        v-on:click="saveDeckLocally(deck)"
        class="">Create</button> -->
    </div>

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
    <button
      v-on:click="addEmptyCard(deck)"
      class="">Add card</button>

  </div>
</template>

<script>
import EditableCard from './EditableCard.vue'

export default {
  name: 'EditableDeck',
  props: {
    subtitle: String
  },
  components: {
    EditableCard
  },

  data () {
    return {
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
