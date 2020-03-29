const branchName = require('current-git-branch')
const cleanBranch = (branch) => branch.replace(/[\W_]+/g, '-')
const setEnvIfUndefined = (name, value) => { process.env[name] = process.env[name] || value }

const branch = branchName()
const stage = cleanBranch(branch)

process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_GIT_BRANCH = branch
process.env.VUE_APP_STAGE = stage

setEnvIfUndefined('VUE_APP_COGNITO_USER_POOL_CLIENT', '4ldbtdjcott19onil1ndjh1ei0')
setEnvIfUndefined('VUE_APP_COGNITO_IDENTITY_POOL', 'eu-west-1:4e22e863-ff0a-436d-8c3c-f9484ce82994')
setEnvIfUndefined('VUE_APP_COGNITO_USER_POOL', 'eu-west-1_maZXR6XzU')
setEnvIfUndefined('VUE_APP_S3_UPLOADS_BUCKET_NAME', 'swipeme.io-dev')
setEnvIfUndefined('VUE_APP_API_BASE_URL', `https://dev.swipeme.io/${stage}/`)
setEnvIfUndefined('VUE_APP_REGION', 'eu-west-1')

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
      acl: 'private',
      pwa: true,
      pwaFiles: 'service-worker.js',
      enableCloudfront: false,
      cloudfrontId: 'banana',
      cloudfrontMatchers: '/*',
      uploadConcurrency: 5,
      pluginVersion: '4.0.0-rc3'
    }
  }
}
