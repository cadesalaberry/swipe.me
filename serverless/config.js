const branchName = require('current-git-branch')()
const cleanBranch = (branch) => branch.replace(/[\W_]+/g, '-')

module.exports = {
  /*
  * Member must satisfy regular expression pattern: [\w\s+=,.@-]+
  */
  getSnakedStage: function () {
    return cleanBranch(branchName).replace(/[-]+/g, '_')
  }
}
