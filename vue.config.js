module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/swipe.me/' : '',
  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: 'default',
      region: 'eu-west-1',
      bucket: 'swipeme.io',
      createBucket: false,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: undefined,
      pwa: true,
      pwaFiles: 'service-worker.js',
      enableCloudfront: false,
      cloudfrontId: 'banana',
      cloudfrontMatchers: '/*',
      uploadConcurrency: 5,
      pluginVersion: '3.0.0'
    }
  }
}
