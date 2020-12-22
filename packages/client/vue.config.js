const brancher = require('@swipeme.io/tools/brancher')

const setEnvIfUndefined = (name, value) => { process.env[name] = process.env[name] || value }

const branch = brancher.getBranchName()
const stage = brancher.dashify(branch)

console.log(`Using branch name: ${branch}`)
console.log(`Using stage name : ${stage}`)

process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_GIT_BRANCH = branch
process.env.VUE_APP_STAGE = stage

setEnvIfUndefined('VUE_APP_API_BASE_URL', `https://api.swipeme.io/${stage}/`)

module.exports = {
}
