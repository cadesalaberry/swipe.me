const brancher = require('@swipeme.io/tools/brancher')

const setEnvIfUndefined = (name, value) => { process.env[name] = process.env[name] || value }

const stageName = brancher.getDashifiedBranch()
const branch = brancher.getBranchName()
const stage = stageName === 'master' ? 'dev' : stageName

console.log(`Using branch name: ${branch}`)
console.log(`Using stage name : ${stage}`)

process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_GIT_BRANCH = branch
process.env.VUE_APP_STAGE = stage

setEnvIfUndefined('VUE_APP_API_BASE_URL', `https://api.swipeme.io/${stage}/`)

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
