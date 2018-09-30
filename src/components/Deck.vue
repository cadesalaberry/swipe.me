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
        ]
        // minThrowOutDistance: 250,
        // maxThrowOutDistance: 300
      },
      loading: true,
      cards: []
    }
  },

  mounted: function () {
    this.$http
      .get('//cadesalaberry.github.io/lucky-you/content.json')
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
    remove () {
      console.log('remove', this.$refs)
    },
    onThrowout ({ target, throwDirection }) {
      this.cards.pop()
      console.log(`Threw out ${target.textContent}!`)
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
.vueswing {
  height: 100%;
}
.card {
  height: 584px;
  width: 360px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  position: absolute;
  top: calc(50% - 292px);
  left: calc(50% - 180px);
}
.card:nth-last-child(2) {
  top: calc(50% - 267px);
  transform: scale(0.95);
}
.card:nth-last-child(n+3) {
  top: calc(50% - 242px);
  transform: scale(0.9);
}
h3 {
  /* margin: 40px 0 0; */
}
a {
  color: #42b983;
}
</style>
