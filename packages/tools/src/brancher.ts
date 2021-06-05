#!/usr/bin/env node

'use strict'
import neodoc from 'neodoc'

const syntax = `
Usage:
  brancher.js
  brancher.js snakeify [--shorten=<max-length>] [<branch-name>]
  brancher.js dashify [--shorten=<max-length>] [<branch-name>]
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
  getBranchName: (): string => {
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
  dashify: (string = ''): string => {
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
  snakeify: (string = ''): string => {
    return `${string}`.replace(/[\W-]+/g, '_')
  },

  hashString: (str = ''): string => {
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

  shortenStringToXCharacters: (string = '', maxSize: number): string => {
    if (string.length <= maxSize) { return string }
    const hash = Brancher.hashString(string)
    const nbAvailableSlots = maxSize - hash.length - 1 - 1 // count the dash & first letter
    const breakpoint = string.length - nbAvailableSlots // start from the end of the string
    const firstLetter = string[0] // the shortened string should always start with a letter

    return `${firstLetter}${string.substring(breakpoint)}-${hash}`
  },

  /**
   * AWS does not allow stage names to contain "aws" in its name.
   * Turns: dependabot/npm_and_yarn/aws-sdk-2.887.0
   * Into : dependabot/npm_and_yarn/swa-sdk-2.887.0
   *
   * @param {string} stageName the stageName to sanitize
   * @returns {string}
   */
  awsSanitize: (stageName: string): string => {
    return (stageName || '').replace('aws', 'swa')
  }
}

const main = async () => {
  const options = neodoc.run(syntax)
  let branchName = options['<branch-name>'] || Brancher.getBranchName()

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
}

module.exports = {
  ...Brancher
}

export default Brancher

// Execute main if the script is not imported
if (require.main === module) main()
