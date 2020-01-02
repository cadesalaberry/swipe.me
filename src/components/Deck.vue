<template>
  <div class="deck">
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
        class="card"
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
          v-if="hiddenCards.length"
          v-on:click="undo"
          class="back-button" />
      </transition>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue'
import Loader from './Loader.vue'
import VueSwing from 'vue-swing'

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
          // VueSwing.Direction.UP,
          // VueSwing.Direction.DOWN,
          VueSwing.Direction.LEFT,
          VueSwing.Direction.RIGHT
        ],
        // minThrowOutDistance: 250,
        // maxThrowOutDistance: 300
        rotation: (x, y, target, max) => {
          return Math.min(x / 20, max)
        },
        throwOutConfidence: (xOffset, yOffset, element) => {
          const xConfidence = Math.min(1.7 * Math.abs(xOffset) / element.offsetWidth, 1)
          const yConfidence = Math.min(1.7 * Math.abs(yOffset) / element.offsetHeight, 1)

          return Math.max(xConfidence, yConfidence)
        }
      },
      loading: true,
      cards: [],
      hiddenCards: []
    }
  },

  mounted: function () {
    this.$http({ url: './lucky-you/content.json' })
      .then(this.replaceCards)
      .catch((err) => {
        console.error('Eror getting content')
        throw err
      })
  },

  methods: {
    replaceCards (response) {
      this.cards = response.data.categories[0].cards
      this.loading = false
    },
    add () {
      console.log('add', this.$refs)
    },
    undo () {
      const card = this.hiddenCards.pop()

      if (!card) {
        return
      }

      this.cards.push(card)
    },
    onThrowout ({ target, throwDirection }) {
      console.log(`Threw out ${target.textContent}!`)
      const card = this.cards.pop()

      if (!card) {
        return
      }

      this.hiddenCards.push(card)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deck {
  height: 100%;
  overflow: hidden;
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
  height: 560px;
  width: 350px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  position: absolute;
  top: calc(45% - 292px);
  left: calc(50% - 175px);
  animation: top 0.3s, transform 0.3s;
}
.card:nth-last-child(2) {
  top: calc(45% - 267px);
  transform: scale(0.95);
  pointer-events: none;
}
.card:nth-last-child(n+3) {
  top: calc(45% - 242px);
  transform: scale(0.9);
  pointer-events: none;
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
  .card:nth-last-child(2) {
    top: calc(45% - 220px);
  }
  .card:nth-last-child(n+3) {
    top: calc(45% - 200px);
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
