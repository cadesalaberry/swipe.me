<template>
  <div class="editable-deck">
    <div
      v-for="(card, index) in deck.cards"
      :key="index"
      class="card"
    >
      <editable-card
        :key="index"
        :card="card"
      />
    </div>
    <button
      v-on:click="addEmptyCard(deck)"
      class="">Add card</button>

    <input v-model="deck.deckHandle" placeholder="Name of the deck">

    <button
      v-on:click="save(deck)"
      class="">Save</button>
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

    if (!this.deck.cards.length) {
      this.deck.cards.push({
        title: '',
        picture_path: 'https://images.unsplash.com/photo-1578666859768-10f9910a2045?auto=format&fit=crop&w=350&h=280&q=80',
        description: ''
      })
    }

    console.log('Loading deck from localStorage', this.deck)
  },

  methods: {
    save: (deck) => {
      const deckToSave = JSON.stringify(deck)

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
  /* height: 100%; */
  overflow-y: scroll;
  display: grid;
  justify-items: center;
  grid-gap: 16px;
  padding-bottom: 32px;
  padding-top: 32px;
}
.sync-button {
  height: 96px;
  width: 96px;
  transform: rotate(0) scale(0.8);
  transition: transform 0.1s;
  background-image: url(../assets/sync.png);
  background-position: center;
  background-size: 100%;
  /* animation: spin 1s linear infinite; */
}

@keyframes spin { 100% { transform:rotate(360deg) scale(0.8); } }

.sync-button:active
{
  transform: rotate(0) scale(1.2);
  transition: transform 0.2s;
}
.card {
  height: 560px;
  width: 350px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  animation: top 0.3s, transform 0.3s;
}
a {
  color: #42b983;
}
@media all and (max-width: 350px) {
  .card {
    height: 480px;
    width: 300px;
    top: calc(45% - 240px);
    left: calc(50% - 150px);
  }
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
</style>
