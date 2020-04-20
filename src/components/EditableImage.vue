<template>
  <div :id="uniqueId">
    <!-- <img class="card__image" :src="pictureURL" /> -->
    <div class="DashboardContainer"></div>
  </div>

</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import AwsAmplify from 'uppy-aws-amplify'

// And their styles (for UI plugins)
require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')

export default {
  name: 'EditableCard',
  props: {
    pictureURL: String,
    uniqueId: String
  },

  data () {
    return {}
  },

  computed: {
  },

  mounted () {
    const uppy = Uppy({
      id: this.uniqueId,
      autoProceed: false,
      debug: true,
      restrictions: {
        maxFileSize: false,
        allowedFileTypes: ['image/*']
      },
      meta: {
      },
      onBeforeFileAdded: (currentFile, files) => Promise.resolve(),
      onBeforeUpload: (files, done) => Promise.resolve()
    })
    uppy.use(Dashboard, {
      inline: true,
      target: '.DashboardContainer',
      replaceTargetContent: true,
      note: 'Images only.',
      height: 280
      // metaFields: [
      //   { id: 'owner', name: 'Owner', placeholder: 'name of the photographer/owner' },
      //   { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
      //   { id: 'order', name: 'Order', placeholder: 'order' }
      // ]
    })

    uppy.use(AwsAmplify, {
      // configured AWS Amplify Storage reference
      // with `get` and `put` methods
      storage: Storage,
      // default options passed to `Storage.get(...)`
      getOptions: {
        download: false
      },
      limit: 1,
      async getUploadParameters (file) {
        return {
          // Example: to avoid filename conflicts
          filename: `${Date.now()}-${file.name}`
        }
      }
    })
  },

  methods: {}
}
</script>

<style src="@uppy/core/dist/style.css"></style>
