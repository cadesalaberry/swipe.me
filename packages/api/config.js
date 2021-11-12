const Brancher = require('@swipeme.io/tools/brancher')

module.exports = async ({ options }) => {
  const { stage: originalStageName } = options
  const stage = Brancher.awsSanitize(originalStageName)
  const snakedStage = Brancher.snakeify(stage)
  const shortStageName = Brancher.shortenStringToXCharacters(stage, 29)
  // cognito.domain(63): swipeme-io-${stage}
  const s3Name = Brancher.shortenStringToXCharacters(stage, 52)
  // provider.functions.app.name(64): api-swipe-me-${stage}-app
  const functionName = Brancher.shortenStringToXCharacters(stage, 47)
  const appDomainUrl = {
    ...{ [stage]: `https://${s3Name}.swipeme.io/` },
    dev: 'https://www.swipeme.io/',
    '': 'http://localhost:8080/'
  }[stage]

  const config = {
    snakedStage,
    shortStageName,
    appDomainUrl,
    s3Name,
    functionName,
    stage
  }

  console.log('Injected config file:', config)

  return config
}
