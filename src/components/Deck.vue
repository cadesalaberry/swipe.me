<template>
  <div class="deck">
    <div
      v-if="error"
      class="vueswing"
    >
      <div
        class="card"
      >
        <card
          title="Oops..."
          :imageURL="oopsImageUrl"
          description="I looked everywhere, but eh, I have nothing to show you!"
        />
      </div>
    </div>
    <vue-swing
      v-if="!loading"
      @throwout="onThrowout"
      :config="config"
      ref="vueswing"
      class="vueswing"
    >
      <div
        v-for="(card, index) in cards"
        :key="card.title"
        class="card md-elevation-1"
        v-bind:class="{
          'card--current': index === currentIndex,
          'card--next': index === currentIndex + 1,
        }"
      >
        <card
          :key="card.title"
          :index="index"
          :title="card.title"
          :imageURL="card.picture_path"
          :description="card.description"
        />
      </div>
    </vue-swing>
    <loader v-else></loader>
    <div class="bottom-bar">
      <transition name="slide-fade">
        <div
          v-if="this.currentIndex"
          v-on:click="previousCard"
          class="back-button" />
      </transition>
    </div>
  </div>
</template>

<script>
import VueSwing from 'vue-swing'
import Card from './Card.vue'
import Loader from './Loader.vue'

import OopsImage from '../assets/oops.png'

export default {
  name: 'Deck',
  props: {
    subtitle: String
  },
  components: {
    VueSwing,
    Loader,
    Card
  },

  data () {
    return {
      config: {
        allowedDirections: [
          VueSwing.Direction.LEFT,
          VueSwing.Direction.RIGHT
        ],
        minThrowOutDistance: 500,
        // maxThrowOutDistance: 300
        rotation: (x, y, target, max) => {
          return Math.min(x / 20, max)
        },
        throwOutConfidence: (xOffset, yOffset, element) => {
          const xConfidence = Math.min(2.5 * Math.abs(xOffset) / element.offsetWidth, 1)
          const yConfidence = Math.min(2.5 * Math.abs(yOffset) / element.offsetHeight, 1)

          return Math.max(xConfidence, yConfidence)
        }
      },
      oopsImageUrl: OopsImage,
      currentIndex: 0
    }
  },
  computed: {
    error () {
      const error = this.$store.getters.getLoadingDeckError
      return error && error.message
    },
    loading () {
      return this.$store.state.loadingDeck
    },
    currentDeck () {
      return this.$store.state.currentDeck
    },
    cards () {
      const deck = this.currentDeck
      return deck ? deck.cards : []
    }
  },
  mounted: function () {
    const deckId = this.$route.params.deckId
    this.$store.dispatch('fetchDeckByHandle', deckId)
  },

  methods: {
    previousCard () {
      const swingCard = this.$refs.vueswing.cards[this.currentIndex - 1]
      const card = this.cards[this.currentIndex - 1]

      if (!card) return false

      const throwFrom = card.swipedDirection === VueSwing.Direction.LEFT ? -500 : 500

      swingCard.throwIn(throwFrom, 0)

      card.swipedDirection = null
      this.currentIndex--

      return true
    },
    nextCard (throwDirection) {
      const card = this.cards[this.currentIndex]

      if (!card) return false

      card.swipedDirection = throwDirection
      this.currentIndex++

      return true
    },
    onThrowout ({ target, throwDirection }) {
      this.nextCard(throwDirection)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deck {
  height: 100%;
  overflow: hidden;

  /* HACK: For some reason a scrollbar appears
   * if the cards are thrown to the right of the visible area
   */
  transform: scale(1);
}
.bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.back-button {
  height: 96px;
  width: 96px;
  transform: scale(0.8);
  transition: transform 0.1s;
  background-image: url(../assets/undo-96.png);
  background-position: center;
  background-size: 100%;
}

.back-button:active
{
  transform: scale(1.2);
  transition: transform 0.2s;
}
.vueswing {
  height: 90%;
}
.card {
  position: absolute;
  top: calc(48% - 560px / 2);
  left: calc(50% - 350px / 2);
}
.card--current {
  z-index: 2;
}
.card--next {
  z-index: 1;
}

a {
  color: #42b983;
}
@media all and (max-width: 360px) {
  .card {
    top: calc(48% - 450px / 2);
    left: calc(50% - 280px / 2);
  }
  .back-button {
    width: 74px;
    height: 74px;
  }

  .bottom-bar {
    height: 100px;
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
