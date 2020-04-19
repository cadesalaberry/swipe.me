#!/usr/bin/env node

const getBranchName = require('current-git-branch')

const BranchValidator = {
  /**
   * Returns the branch name with all invalid characters
   * replaced by dashes (-).
   */
  getDashifiedBranch: function () {
    return getBranchName().replace(/[\W_]+/g, '-')
  },

  /*
   * Returns the branch name with all invalid characters
   * replaced by underscores (_). It prevents the following error
   * when creating resources on AWS:
   *
   *    Member must satisfy regular expression pattern: [\w\s+=,.@-]+
   *
   */
  getSnakedBranchName: function () {
    return this.getDashifiedBranch().replace(/[-]+/g, '_')
  },

  /**
   * Gets the name of the IAM Role that will be created for this stage.
   * It is based on the name of the branch.
   */
  getIamRoleName: function () {
    const name = this.getDashifiedBranch()

    return `api-swipe-me-${name}-eu-west-1-lambdaRole`
  },

  validateCurrentBranchName: function () {
    const name = this.getIamRoleName()
    const size = name.length

    // The branch name is valid, nothing to do
    if (size <= 64) return

    throw new Error(`The name of the branch is too long (${size}/64)`)
  }
}

module.exports = {
  ...BranchValidator
}

if (require.main === module) {
  BranchValidator.validateCurrentBranchName()
}
