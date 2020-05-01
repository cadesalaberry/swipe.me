<template>

  <label :for="id + '-image-file'" class="label">
    <input :id="id + '-image-file'"
            class="hidden__input"
            type="file"
            accept="image/*"
            @change="onFileChange"
            name="image">

    <img v-if="previewData" class="image__preview blured" :src="previewData" />
    <img v-if="!previewData && value" class="image__preview" :src="value" />

    <md-progress-bar class="progress__bar" md-mode="indeterminate" v-if="loading" />
    <div class="upload__overlay">
      <md-icon class="upload__button md-size-5x">add_a_photo</md-icon>

      <md-snackbar md-position="center" :md-duration="Infinity" :md-active="!!uploadError" md-persistent>
        <span>{{ uploadError && uploadError.message }}</span>
        <md-button class="md-primary" @click="onDismissError">Dismiss</md-button>
      </md-snackbar>
    </div>

  </label>
</template>

<script>
import { uploadFile, preloadImage, loadImagePreview } from '@/libs/storage'

export default {
  name: 'EditableCard',
  props: {
    value: String, // holds the pictureURL
    id: String
  },

  data () {
    return {
      uploadError: null,
      previewData: null,
      loading: false
    }
  },

  methods: {
    onFileChange (event) {
      const file = event.target.files[0]
      this.loading = true

      return Promise.resolve()
        .then(() => loadImagePreview(file))
        .then((previewData) => { this.previewData = previewData })
        .then(() => uploadFile(file))
        .then(({ url }) => preloadImage(url))
        .then(pictureUrl => this.$emit('input', pictureUrl))
        .catch(e => {
          console.error(e)
          this.uploadError = e
        })
        .finally(() => {
          this.previewData = null
          this.loading = false
        })
    },

    onDismissError () {
      this.uploadError = null
    }
  }
}
</script>

<style scoped>
.label {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.label:hover > img, .label:active > img {
  filter: blur(5px);
}
.upload__overlay {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  opacity: 0;
  transition: opacity .2s ease-out;
}
.upload__overlay:hover {
  opacity: 1;
}
.progress__bar {
  position: absolute;
  width: 100%;
  bottom: 0;
}
.hidden__input {
  display: none;
}
.image__preview {
  object-fit: cover;
  height: 100%;
  width: 100%;
  transition: filter .4s ease-out;
}
.image__preview.blured {
  filter: blur(5px);
}
</style>
