<template>
  <md-card class="tile__container">
    <img class="tile__image" :src="imageURL" />

    <div class="tile_text">
      <h1 class="tile__title">{{ title }}</h1>
      <p class="tile__description" v-html="shortDescription"></p>
    </div>

  </md-card>
</template>

<script>
const LONGEST_STRING_SIZE = 120

export default {
  name: 'DeckSummary',
  props: {
    title: String,
    imageURL: String,
    description: String
  },
  computed: {
    shortDescription () {
      const description = this.description || ''
      const cleaned = this.stripHtmlFromString(description)
      const shortened = cleaned.length >= LONGEST_STRING_SIZE
        ? `${cleaned.substring(0, LONGEST_STRING_SIZE - 3)}...`
        : cleaned

      return shortened
    }
  },
  methods: {
    stripHtmlFromString (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html')

      return doc.body.textContent || ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile__container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: #fff;
  border-radius: 6px;
}
.tile__image {
  object-fit: cover;
  width: 38.2%;
  height: 100%;
}
.tile_text {
  width: 61.8%;
  padding-left: 12px;
  padding-right: 6px;
  padding-top: 24px;
  padding-bottom: 12px;
}
.tile__title {
  /* padding: 0 15px; */
  line-height: 28px;
  margin-block-start: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tile__description {
  height: 100%;
  /* padding: 0 15px; */
}
a {
  color: #42b983;
}
</style>
