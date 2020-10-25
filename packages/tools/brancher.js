#!/usr/bin/env node

'use strict'
const neodoc = require('neodoc')

const syntax = `
Usage:
  brancher.js
  brancher.js validate
  brancher.js snakeify [--shorten=<max-length>]
  brancher.js dashify [--shorten=<max-length>]
`

let getBranchNameFromGit = () => { throw new Error('current-git-branch is not installed') }
try {
  getBranchNameFromGit = require('current-git-branch')
} catch (e) {
  console.warn('current-git-branch is not installed, proceeding without')
}

const Brancher = {
  /**
   * Gets the name of the branch. Supports the folowing env:
   *   * netlify
   *   * CircleCI
   *   * git
   */
  getBranchName: function () {
    if (process.env.CIRCLECI_BRANCH) return process.env.CIRCLECI_BRANCH
    if (process.env.NETLIFY) return process.env.HEAD
    return getBranchNameFromGit()
  },

  /**
   * Returns the branch name with all invalid characters
   * replaced by dashes (-).
   */
  getDashifiedBranch: function () {
    return this.getBranchName().replace(/[\W_]+/g, '-')
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
    return this.snakeify(this.getDashifiedBranch())
  },

  snakeify: function (string = '') {
    return `${string}`.replace(/[-]+/g, '_')
  },

  hashString: function (str) {
    let hash = 5381
    let i = str.length

    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i)
    }

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return `${hash >>> 0}`
  },

  shortenStringToXCharacters: function (string = '', maxSize) {
    if (string.length <= maxSize) { return string }
    const hash = Brancher.hashString(string)
    const nbAvailableSlots = maxSize - hash.length
    const breakpoint = string.length - nbAvailableSlots // start from the end of the string

    return `${string.substring(breakpoint)}_${hash}`
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
  ...Brancher
}

if (require.main !== module) return

const options = neodoc.run(syntax)
let branchName = Brancher.getBranchName()

if (options.snakeify) {
  branchName = Brancher.getSnakedBranchName()
}

if (options.dashify) {
  branchName = Brancher.getDashifiedBranch()
}

if (options['--shorten']) {
  branchName = Brancher.shortenStringToXCharacters(branchName, options['--shorten'])
}

console.log(branchName)

if (options.validate) {
  Brancher.validateCurrentBranchName()
  console.log('✔ Branch name is valid')
}
