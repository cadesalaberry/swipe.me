<template>
  <div class="card__container">
    <img class="card__image" :src="imageURL" />

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
  object-fit: cover;
  width: 100%;
  height: 50%;
  pointer-events: none;
}
.card__title {
  padding: 0 15px;
  margin-block-start: 18px;
}
.card__description {
  padding: 0 15px;
}
a {
  color: #42b983;
}
</style>
