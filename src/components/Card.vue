<template>
  <div class="card__container">
    <img class="card__image" :src="patchURL(imageURL)" />

    <h1 class="card__title">{{ title }}</h1>
    <div class="card__description" v-html="description"></div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    imageURL: String,
    description: String
  },
  methods: {
    patchURL: (imageURL) => {
      // HACK: Keep compatibility with old website
      if (imageURL.startsWith('./assets/images/')) {
        return '//cadesalaberry.github.io/lucky-you/' + imageURL
      }

      return imageURL
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card__container {
  height: 100%;
  background-color: #fff;
}
.card__image {
  object-fit: contain;
  width: 100%;
  height: 50%;
}
.card__title {
  padding: 0 10px;
}
.card__description {
  padding: 0 10px;
}
a {
  color: #42b983;
}
</style>
