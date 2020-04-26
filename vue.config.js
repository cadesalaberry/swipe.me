// HACK: Avoids getting -HEAD-detached-at-FETCH-HEAD- on netlify
const branchValidator = require('./tools/branch-validator')
const setEnvIfUndefined = (name, value) => { process.env[name] = process.env[name] || value }

const stageName = branchValidator.getDashifiedBranch()
const branch = branchValidator.getBranchName()
const stage = stageName === 'master' ? 'dev' : stageName

console.log(`Using branch name: ${branch}`)
console.log(`Using stage name : ${stage}`)

process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_GIT_BRANCH = branch
process.env.VUE_APP_STAGE = stage

setEnvIfUndefined('VUE_APP_S3_UPLOADS_BUCKET_NAME', 'swipeme.io-dev')
setEnvIfUndefined('VUE_APP_API_BASE_URL', `https://dev.swipeme.io/${stage}/`)

module.exports = {
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
