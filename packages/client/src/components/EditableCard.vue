<template>
  <div class="card__container">

    <editable-image :value="card.picturePath"
                    class="card__image"
                    @change="this.onImageEdition" />

    <h1 class="card__title">
      <input placeholder="Title"
             :value="card.title"
             @change="this.onTitleEdition">
    </h1>
    <div class="card__description">
      <textarea placeholder="Some short description"
                :value="card.description"
                @change="this.onDescriptionEdition"></textarea>
    </div>
  </div>
</template>

<script>
import EditableImage from '@/components/EditableImage'

export default {
  name: 'EditableCard',
  props: {
    card: {
      title: String,
      picturePath: String,
      description: String
    }
  },
  components: {
    EditableImage
  },
  methods: {
    onTitleEdition ({ target: { value: newTitle } }) {
      const { picturePath, description } = this.card
      this.onCardEdited({
        title: newTitle,
        picturePath,
        description
      })
    },
    onImageEdition (newImageUrl) {
      const { title, description } = this.card
      this.onCardEdited({
        title,
        picturePath: newImageUrl,
        description
      })
    },
    onDescriptionEdition ({ target: { value: newDescription } }) {
      const { title, picturePath } = this.card
      this.onCardEdited({
        title,
        picturePath,
        description: newDescription
      })
    },
    onCardEdited (newCard) {
      this.$emit('onCardEdited', newCard)
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
  object-fit: cover;
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
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
  width: 100%;
}

textarea {
  height: 145px;
}
</style>
