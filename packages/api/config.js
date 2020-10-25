const Brancher = require('@swipeme.io/tools/brancher')

module.exports = (serverless) => {
  const { stage } = serverless.variables.options
  const snakedStage = Brancher.snakeify(stage)
  const shortStageName = Brancher.shortenStringToXCharacters(stage, 29)
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
