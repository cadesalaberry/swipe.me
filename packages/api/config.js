const BranchValidator = require('../tools/branch-validator')

module.exports = (serverless) => {
  const { stage } = serverless.variables.options
  const snakedStage = BranchValidator.snakeify(stage)
  const config = { snakedStage }

  console.log('Injected config file:', config)

  return config
}
