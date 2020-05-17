const BranchValidator = require('../tools/branch-validator')

module.exports = (serverless) => {
  const { stage } = serverless.variables.options
  const snakedStage = BranchValidator.snakeify(stage)
  const appDomainUrl = stage === 'dev' ? 'http://swipeme.io/' : 'http://localhost:8080/'
  const config = {
    snakedStage,
    appDomainUrl
  }

  console.log('Injected config file:', config)

  return config
}
