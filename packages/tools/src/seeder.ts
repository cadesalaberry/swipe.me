#!/usr/bin/env node

'use strict'
import { mkdirSync, writeFileSync } from 'fs'
import { join as pathJoin } from 'path'
import neodoc from 'neodoc'
import { spawnSync } from 'child_process'
import {
  AWSError,
  CognitoIdentityServiceProvider,
  DynamoDB
} from 'aws-sdk'
import { backupUsers, restoreUsers } from 'cognito-backup-restore'
import { PromiseResult } from 'aws-sdk/lib/request'

import Brancher from './brancher'

const {
  PATH
} = process.env

const EXPORT_FOLDER = pathJoin(__dirname, '.dumps')

const syntax = `
By default data will be imported from master to the stage associated to the current branch.
Usage:
  seeder.js
  seeder.js [--from-cache] [--dump-only] [--from-branch=<source-branch>] [<target-branch>]
`

const Seeder = {
  /**
   * Backs up the cognito users to the `.dumps` folder
   *
   * @param {String} userPoolId the ID of the pool you want to backup
   * @param {String} exportFolder the folder where to store the backup
   */
  dumpCognitoFromUserPoolId: (userPoolId = '', exportFolder = ''): Promise<void> => {
    const cognitoParams = Seeder.getCognitoParams(userPoolId)
    const cognitoISP = new CognitoIdentityServiceProvider(cognitoParams)

    return backupUsers(cognitoISP, userPoolId, exportFolder)
  },

  /**
   * Backs up all data from stage to the `.dumps` folder
   *
   * @param {String} stageName the name of the stage you want to backup data from
   */
  dumpDataFromStage: async (stageName = ''): Promise<void> => {
    const exportFolder = pathJoin(EXPORT_FOLDER, stageName)
    const exportCognitoFolder = exportFolder
    const exportDBDeckFile = pathJoin(exportFolder, 'dynamodb-deck.json')
    const exportDBSingleFile = pathJoin(exportFolder, 'dynamodb-single.json')
    const exportS3Folder = pathJoin(exportFolder, 's3')
    const s3Name = 'api-swipe-me-master-s3bucket-156n8almk2y5u'
    const userPoolId = 'eu-west-1_gFeeEp3Mo'

    console.log(`Dumping data for stage ${stageName}:`)
    mkdirSync(exportFolder, { recursive: true })

    console.log(`* Dumping data from user pool ${userPoolId}...`)
    await Seeder.dumpCognitoFromUserPoolId(userPoolId, exportCognitoFolder)

    console.log(`* Dumping data from table decks-table-${stageName}...`)
    await Seeder.dumpDataFromDynamoDBTable(`decks-table-${stageName}`, exportDBDeckFile)

    if (stageName !== 'master') {
      console.log(`* Dumping data from table single-table-${stageName}...`)
      await Seeder.dumpDataFromDynamoDBTable(`single-table-${stageName}`, exportDBSingleFile)
    }

    mkdirSync(exportS3Folder, { recursive: true })

    await Seeder.dumpFilesFromS3(s3Name, exportS3Folder)

    console.log(`Done dumping data for stage ${stageName}...`)
  },

  /**
   * Backs up all data from stage to the `.dumps` folder
   *
   * @param {String} stageName the name of the stage you want to backup data from
   */
  injectDataToStage: async (sourceStage = '', targetStage = ''): Promise<void> => {
    const sourceFolder = pathJoin(EXPORT_FOLDER, sourceStage)
    const sourceDBDeckFile = pathJoin(sourceFolder, 'dynamodb-deck.json')
    const sourceDBSingleFile = pathJoin(sourceFolder, 'dynamodb-single.json')

    console.log(`Injecting data to stage ${targetStage}:`)

    console.log(`* Injecting data to table decks-table-${targetStage}...`)
    await Seeder.seedDataFromDynamoDBTable(`decks-table-${targetStage}`, sourceDBDeckFile)

    console.log(`* Injecting data to table single-table-${targetStage}...`)
    await Seeder.seedDataFromDynamoDBTable(`single-table-${targetStage}`, sourceDBSingleFile)

    console.log(`Done injecting data to stage ${targetStage}.`)
  },

  /**
   * Backs up the content of the table to the `.dumps` folder
   *
   * @param {String} tableName the name of the table you want to backup
   */
  dumpDataFromDynamoDBTable: async (tableName = '', exportDBFile = ''): Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>> => {
    const params = Seeder.getCognitoParams()
    const dynamoDB = new DynamoDB.DocumentClient(params)
    const scanQuery = { TableName: tableName }

    const scanResults = await dynamoDB.scan(scanQuery).promise()
    const stringContent = JSON.stringify(scanResults, null, 2)

    writeFileSync(exportDBFile, stringContent)

    return scanResults
  },

  /**
   * Inject the provided JSON into the given table
   *
   * @param {String} tableName the name of the table you want to backup
   * @param {String} jsonDataLocation the items to add to the table
   */
  seedDataFromDynamoDBTable: async (tableName = '', jsonDataLocation = ''): Promise<unknown[]> => {
    const params = Seeder.getCognitoParams()
    const dynamoDB = new DynamoDB.DocumentClient(params)
    const { Count, Items: items } = require(jsonDataLocation)
    const putItem = async (item) => {
      const putQuery = {
        TableName: tableName,
        Item: item
      }

      const reply = await dynamoDB.put(putQuery).promise()

      console.log(putQuery, reply)

      return reply
    }

    console.log(jsonDataLocation, Count)

    return Promise.all(items.map(putItem))
  },

  /**
   * Backs up the content of the table to the `.dumps` folder
   *
   * @param {String} s3Name the name of the s3 bucket you want to backup
   */
  dumpFilesFromS3: async (s3Name = '', exportFolder = ''): Promise<string[]> => {
    const awsArgs = ['s3', 'sync', `s3://${s3Name}`, exportFolder]

    // console.log(`Running command: aws ${awsArgs.join(' ')}`)

    const running = spawnSync('aws', awsArgs, { env: { PATH } })
    const results = [
      (running.stdout || '').toString(),
      (running.stderr || '').toString()
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
   */
  seedCognitoWithUserPoolId: async (userPoolId = '', targetUserPoolId = ''): Promise<void> => {
    const cognitoParams = Seeder.getCognitoParams(targetUserPoolId)
    const dumpPath = pathJoin(EXPORT_FOLDER, `${userPoolId}.json`)
    const cognitoISP = new CognitoIdentityServiceProvider(cognitoParams)

    return restoreUsers(cognitoISP, targetUserPoolId, dumpPath)
  },

  /**
   * @param {String} userPoolId the userPoolId to extract the region from
   */
  getCognitoParams: (userPoolId = ''): { region: string } => {
    const {
      AWS_REGION
    } = process.env
    const extracted = userPoolId.split('_')[0]
    return {
      region: AWS_REGION || extracted || 'eu-west-1'
    }
  },

  /**
   * @param {String} branchName the branchName to get the stage from
   */
  getStageNameFromBranch: (branchName = ''): string => {
    return Brancher.dashify(branchName)
  }
}

const main = async () => {
  const options = neodoc.run(syntax)

  console.log(options)

  // let masterPoolId = 'eu-west-1_gFeeEp3Mo'
  // let targetUserPoolId = 'eu-west-1_w2a8KV3G1'
  const targetBranchName = options['<target-branch>'] || Brancher.getBranchName()
  const sourceBranchName = options['--from-branch'] || 'master'
  const dumpOnly = options['--dump-only']
  const fromCache = options['--from-cache']

  const sourceStage = Seeder.getStageNameFromBranch(sourceBranchName)
  const targetStage = Seeder.getStageNameFromBranch(targetBranchName)

  console.log(`Seeding stage...\nfrom: ${sourceStage}\nto  : ${targetStage}`)

  if (!fromCache) await Seeder.dumpDataFromStage(sourceStage)
  else console.log('Using cache. skipping data dump')

  if (!dumpOnly) await Seeder.injectDataToStage(sourceStage, targetStage)
  else console.log('Dump only mode. skipping data injection')

  console.log(`Work on branch "${sourceBranchName}" done.`)
}

module.exports = {
  ...Seeder
}

export default Seeder

// Execute main if the script is not imported
if (require.main === module) main()
