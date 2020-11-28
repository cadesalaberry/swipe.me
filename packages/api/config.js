const Brancher = require('@swipeme.io/tools/brancher')

module.exports = (serverless) => {
  const { stage } = serverless.variables.options
  const snakedStage = Brancher.snakeify(stage)
  const shortStageName = Brancher.shortenStringToXCharacters(stage, 29)
  const s3Name = Brancher.shortenStringToXCharacters(stage, 52)
  const appDomainUrl = {
    ...{ [stage]: `https://${s3Name}.swipeme.io/` },
    dev: 'https://www.swipeme.io/',
    undefined: 'http://localhost:8080/'
  }[stage]

  const config = {
    snakedStage,
    shortStageName,
    appDomainUrl,
    s3Name
  }

  console.log('Injected config file:', config)

  return config
}
