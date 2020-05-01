<template>
    <img
      :src="imageUrl"
      v-bind:class="{
        'immage__preview': true,
        'blurred': this.loading || this.blurred,
      }" />
</template>

<script>
import { getAuthenticatedUrl, preloadImage } from '@/libs/storage'

export default {
  name: 'ProtectedImage',
  props: {
    src: String, // holds the pictureURL
    blurred: Boolean
  },
  data () {
    return {
      imageUrl: '',
      loading: false
    }
  },
  async mounted () {
    this.loading = true
    await preloadImage(this.src)
    this.imageUrl = await getAuthenticatedUrl(this.src)
    this.loading = false
  },
  methods: {

  }
}
</script>

<style scoped>
.image__preview {
  object-fit: cover;
  height: 100%;
  width: 100%;
  transition: filter .4s ease-out;
}
.image__preview.blurred {
  filter: blur(5px);
}
</style>
