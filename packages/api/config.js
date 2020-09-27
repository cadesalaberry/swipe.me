const Brancher = require('@swipeme.io/tools/brancher')

const hashString = (str) => {
  let hash = 5381
  let i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return `${hash >>> 0}`
}

const shortenStringToXCharacters = (string = '', maxSize) => {
  if (string.length <= maxSize) { return string }
  const hash = hashString(string)
  const nbAvailableSlots = maxSize - hash.length
  const breakpoint = string.length - nbAvailableSlots // start from the end of the string

  return `${string.substring(breakpoint)}_${hash}`
}

module.exports = (serverless) => {
  const { stage } = serverless.variables.options
  const snakedStage = Brancher.snakeify(stage)
  const shortStageName = shortenStringToXCharacters(stage, 29)
  const roleName = `api-swipe-me-${shortStageName}-eu-west-1-lambdaRole`
  const appDomainUrl = {
    ...{ [stage]: `https://${stage}.swipeme.io/` },
    dev: 'https://www.swipeme.io/',
    undefined: 'http://localhost:8080/'
  }[stage]

  // the resulting stage name should be smaller than 64 characters
  if (roleName.length > 64) throw new Error(`iamRoleStatementsName too long ${roleName.length}/64`)

  const config = {
    snakedStage,
    shortStageName,
    appDomainUrl
  }

  console.log('Injected config file:', config)

  return config
}
