<template>
  <div class="card">
    <img class="card-image" :src="patchURL(imageURL)" />

    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
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
      if (imageURL.startsWith('./')) {
        return 'https://cadesalaberry.github.io/lucky-you/' + imageURL
      }

      return imageURL
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  background-color: #fff;
}
.card-image {
  object-fit: cover;
  width: 100%;
  height: 300px;
}
a {
  color: #42b983;
}
</style>
