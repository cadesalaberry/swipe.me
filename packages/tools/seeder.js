#!/usr/bin/env node

'use strict'
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const neodoc = require('neodoc')
const cognitoBackup = require('cognito-backup-restore')
const brancher = require('@swipeme.io/tools/brancher')
const spawnSync = require('child_process').spawnSync;

const {
  PATH,
} = process.env;

const EXPORT_FOLDER = path.join(__dirname, '.dumps')

const syntax = `
By default data will be imported from master to the stage associated to the current branch.
Usage:
  seeder.js
  seeder.js [--from-branch=<source-branch>] [<target-branch>]
`

const Seeder = {
  /**
   * Backs up the cognito users to the `.dumps` folder
   * 
   * @param {String} userPoolId the ID of the pool you want to backup
   * @param {String} exportFolder the folder where to store the backup
   */
  dumpCognitoFromUserPoolId: (userPoolId, exportFolder) => {
    const cognitoParams = Seeder.getCognitoParams(userPoolId)
    const cognitoISP = new AWS.CognitoIdentityServiceProvider(cognitoParams)
    
    return cognitoBackup.backupUsers(cognitoISP, userPoolId, exportFolder)
  },

    /**
   * Backs up all data from stage to the `.dumps` folder
   * 
   * @param {String} stageName the name of the stage you want to backup data from
   */
  dumpDataFromStage: async (stageName) => {
  
    const exportFolder = path.join(EXPORT_FOLDER, stageName)
    const exportCognitoFolder = path.join(EXPORT_FOLDER, stageName)
    const exportDBDeckFile = path.join(EXPORT_FOLDER, stageName, `dynamodb-deck.json`)
    const exportDBSingleFile = path.join(EXPORT_FOLDER, stageName, `dynamodb-single.json`)
    const exportS3Folder = path.join(EXPORT_FOLDER, stageName, 's3')
    const s3Name = 'api-swipe-me-master-s3bucket-156n8almk2y5u'
    const userPoolId = 'eu-west-1_gFeeEp3Mo'

    console.log(`Dumping data for stage ${stageName}:`)
    console.log(`* Dumping data from user pool ${userPoolId}...`)
    Seeder.dumpCognitoFromUserPoolId(userPoolId, exportCognitoFolder)

    fs.mkdirSync(exportFolder, { recursive: true })

    console.log(`* Dumping data from table decks-table-${stageName}...`)
    await Seeder.dumpDataFromDynamoDBTable(`decks-table-${stageName}`, exportDBDeckFile)

    if (stageName !== 'master') {
      console.log(`* Dumping data from table single-table-${stageName}...`)
      await Seeder.dumpDataFromDynamoDBTable(`single-table-${stageName}`, exportDBSingleFile)
    }

    fs.mkdirSync(exportS3Folder, { recursive: true })

    await Seeder.dumpFilesFromS3(s3Name, exportS3Folder)

    console.log(`Done dumping data for stage ${stageName}...`)
  },

  /**
   * Backs up the content of the table to the `.dumps` folder
   * 
   * @param {String} tableName the name of the table you want to backup
   */
  dumpDataFromDynamoDBTable: async (tableName, exportDBFile) => {
    const params = Seeder.getCognitoParams()
    const dynamoDB = new AWS.DynamoDB.DocumentClient(params)
    const scanQuery = { TableName: tableName }
    
    const scanResults = await dynamoDB.scan(scanQuery).promise()
    const stringContent = JSON.stringify(scanResults, null, 2)

    fs.writeFileSync(exportDBFile, stringContent)

    return scanResults
  },

    /**
   * Backs up the content of the table to the `.dumps` folder
   * 
   * @param {String} s3Name the name of the s3 bucket you want to backup
   */
  dumpFilesFromS3: async (s3Name, exportFolder) => {
    const awsArgs = ['s3', 'sync', `s3://${s3Name}`, exportFolder]

    // console.log(`Running command: aws ${awsArgs.join(' ')}`)

    const running = spawnSync('aws', awsArgs, { env: { PATH } })
    const results = [
      (running.stdout || '').toString(),
      (running.stderr || '').toString(),
    ]

    // console.log(results.join('\n\n\n'))

    return results
  },
  
  /**
   * This function does not keep the 'identities' part of the user,
   * which drops the link with google auth.
   * 
   * @deprecated
   * 
   * @param {String} userPoolId the ID of the pool you want to backup
   */
  seedCognitoWithUserPoolId: (userPoolId, targetUserPoolId) => {
   const cognitoParams = Seeder.getCognitoParams(targetUserPoolId)
   const dumpPath = path.join(EXPORT_FOLDER, `${userPoolId}.json`)
   const cognitoISP = new AWS.CognitoIdentityServiceProvider(cognitoParams)
   
   return cognitoBackup.restoreUsers(cognitoISP, targetUserPoolId, dumpPath)
 },
  
  /**
   * @param {String} userPoolId the userPoolId to extract the region from
   */
  getCognitoParams: function (userPoolId) {
    const {
      AWS_REGION,
    } = process.env
    const extracted = (userPoolId || '').split('_')[0]
    return {
      region: AWS_REGION || extracted || 'eu-west-1',
    }
  },

  /**
   * @param {String} branchName the branchName to get the stage from
   */
  getStageNameFromBranch: function (branchName) {
    return brancher.dashify(branchName)
  },
}

const main = async () => {
  const options = neodoc.run(syntax)

  // let masterPoolId = 'eu-west-1_gFeeEp3Mo'
  // let targetUserPoolId = 'eu-west-1_w2a8KV3G1'
  let targetBranchName = options['<target-branch>'] || brancher.getBranchName()
  let sourceBranchName = options['<source-branch>'] || 'master'  

  const sourceStage = Seeder.getStageNameFromBranch(sourceBranchName)
  const targetStage = Seeder.getStageNameFromBranch(targetBranchName)

  await Seeder.dumpDataFromStage(sourceStage)
  // console.log(`Saving users in pool ${targetUserPoolId}...`)
  // await Seeder.dumpCognitoFromUserPoolId(targetUserPoolId)
  // console.log(`Importing users from pool ${masterPoolId} to pool ${targetUserPoolId}...`)
  // await Seeder.seedCognitoWithUserPoolId(masterPoolId, targetUserPoolId)
  // console.log(`Saving users in pool ${targetUserPoolId}...`)
  // await Seeder.dumpCognitoFromUserPoolId(targetUserPoolId)

  console.log(`Work on branch "${sourceBranchName}" done.`)
}

module.exports = {
  ...Seeder
}

if (require.main !== module) return

main()