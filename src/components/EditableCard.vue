<template>
  <div class="card__container">

    <editable-image :id="'image-' + uniqueId"
                    v-model="card.picture_path"
                    class="card__image"
                    @input="this.onCardEdited"/>

    <h1 class="card__title">
      <input placeholder="Title"
             v-model="card.title"
             @keyup="this.onCardEdited">
    </h1>
    <div class="card__description">
      <textarea placeholder="Some short description"
                v-model="card.description"
                @keyup="this.onCardEdited"></textarea>
    </div>
  </div>
</template>

<script>
import EditableImage from './EditableImage.vue'

export default {
  name: 'EditableCard',
  props: {
    card: {
      title: String,
      picture_path: String,
      description: String
    },
    uniqueId: String
  },
  components: {
    EditableImage
  },
  methods: {
    onCardEdited () {
      this.$emit('onCardEdited')
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
  font-size: 1.3em;
}
.card__description {
  padding: 0 10px;
}
a {
  color: #42b983;
}

.card__title input {
  font-size: 2em;
}

input, textarea {
  border:none;
  background-image:none;
  background-color:transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  width: 100%;
}

textarea {
  height: 145px;
}
</style>
