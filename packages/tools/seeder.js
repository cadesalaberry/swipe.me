#!/usr/bin/env node

'use strict'
const neodoc = require('neodoc')
const brancher = require('@swipeme.io/tools/brancher')

const syntax = `
By default data will be imported from master to the stage associated to the current branch.
Usage:
  seeder.js
  seeder.js [--from-stage=<source-userbase>] [<destination-userbase>]
`

const Seeder = {
  /**
   * Gets the name of the branch. Supports the folowing env:
   *   * netlify
   *   * CircleCI
   *   * git
   */
  dumpCognitoFromStage: function (stageName) {
    const {
      GITHUB_EVENT_NAME,
      GITHUB_EVENT_PATH,
      CIRCLECI_BRANCH,
      NETLIFY,
      HEAD
    } = process.env

    // Get the name of the deleted branch if the job is executed on a delete branch event
    if (GITHUB_EVENT_PATH && GITHUB_EVENT_NAME === 'delete') return require(`${GITHUB_EVENT_PATH}`).ref
    if (CIRCLECI_BRANCH) return CIRCLECI_BRANCH
    if (NETLIFY) return HEAD

    return getBranchNameFromGit()
  },

  /**
   * Returns the branch name with all invalid characters
   * replaced by dashes (-).
   */
  dashify: function (string = '') {
    return `${string}`.replace(/[\W_]+/g, '-')
  },

  /*
   * Returns the branch name with all invalid characters
   * replaced by underscores (_). It prevents the following error
   * when creating resources on AWS:
   *
   *    Member must satisfy regular expression pattern: [\w\s+=,.@-]+
   *
   */
  snakeify: function (string = '') {
    return `${string}`.replace(/[\W-]+/g, '_')
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
    const unsigned = hash >>> 0

    // No need to be too complex, 4 digits should be enough
    return `${unsigned % 9999}`
  },

  shortenStringToXCharacters: function (string = '', maxSize) {
    if (string.length <= maxSize) { return string }
    const hash = Brancher.hashString(string)
    const nbAvailableSlots = maxSize - hash.length - 1 - 1 // count the dash & first letter
    const breakpoint = string.length - nbAvailableSlots // start from the end of the string
    const firstLetter = string[0] // the shortened string should always start with a letter

    return `${firstLetter}${string.substring(breakpoint)}-${hash}`
  }
}

module.exports = {
  ...Brancher
}

if (require.main !== module) return

const options = neodoc.run(syntax)
let branchName = Brancher.getBranchName()

if (options.snakeify) {
  branchName = Brancher.snakeify(branchName)
}

if (options.dashify) {
  branchName = Brancher.dashify(branchName)
}

if (options['--shorten']) {
  branchName = Brancher.shortenStringToXCharacters(branchName, options['--shorten'])
}

console.log(branchName)
