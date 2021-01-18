import { CognitoIdentityServiceProvider } from 'aws-sdk'
import asyncPool from 'tiny-async-pool'
import Namer from '@swipeme.io/common/namer'

import { getConfig } from '../config'
import dynamoDb from '../libs/dynamodb-lib'
import BackError from '../libs/back.error'

import type { DeleteItemInput, DocumentClient, PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb'
import type { Handler } from 'express'

const SINGLE_TABLE = process.env.SINGLE_TABLE || ''

const validateUsername = (username: string) => {
  if (Namer.sanitizeHandle(username) !== username) throw new Error('Username contains invalid characters')
}

const getAllEntriesForUsername = (username: string) => {
  const params = {
    TableName: SINGLE_TABLE,
    KeyConditionExpression: 'PK = :ownerHandle',
    Select: 'ALL_ATTRIBUTES',
    ExpressionAttributeValues: {
      ':ownerHandle': Namer.getPKFromUserHandle(username)
    }
  }

  return dynamoDb
    .query(params as QueryInput)
    .then((result) => result.Items || [])
}

const deleteAllEntries = (entries: DocumentClient.ItemList) => {
  const deleteSingleEntry = (entry: DocumentClient.AttributeMap) => {
    return dynamoDb
      .delete({
        TableName: SINGLE_TABLE,
        Key: {
          PK: entry.PK,
          SK: entry.SK
        }
      } as DeleteItemInput)
      .then((result) => result.Attributes)
  }

  return asyncPool(5, entries, deleteSingleEntry)
}

const addAllEntriesToUsername = (entries: DocumentClient.ItemList, username: string) => {
  const createSingleEntry = (entry: DocumentClient.AttributeMap) => {
    return dynamoDb
      .put({
        TableName: SINGLE_TABLE,
        Item: {
          ...entry,
          PK: Namer.getPKFromUserHandle(username)
        }
      } as PutItemInput)
      .then((result) => result.Attributes)
  }

  return asyncPool(5, entries, createSingleEntry)
}

const changeUsername: Handler = async (req, res) => {
  const { cognitoRegion, cognitoUserPoolId } = getConfig()
  const cognitoIdServiceProvider = new CognitoIdentityServiceProvider({
    region: cognitoRegion
  })
  const updateUserAttributes = (newAttributes: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest) => new Promise((resolve, reject) => {
    cognitoIdServiceProvider.adminUpdateUserAttributes(newAttributes, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })

  const {
    username,
    newPreferredUsername
  } = req.body

  const params = {
    UserAttributes: [
      {
        Name: 'preferred_username',
        Value: newPreferredUsername
      }
    ],
    UserPoolId: cognitoUserPoolId,
    Username: username
  }

  return Promise.resolve()
    .then(() => validateUsername(newPreferredUsername))
    .then(() => console.log('name validated'))
    .then(() => getAllEntriesForUsername(newPreferredUsername))
    .then((entries) => {
      if (entries && entries.length) throw new BackError('This username is already taken')
      // if (true) throw new BackError('This username is already taken')
    })
    .then(() => getAllEntriesForUsername(newPreferredUsername))
    .then((entries) => {
      console.log('entries2', entries)
      return addAllEntriesToUsername(entries, newPreferredUsername)
        .then(() => deleteAllEntries(entries))
    })
    .then(() => updateUserAttributes(params))
    .then(() => res.json({ username, newPreferredUsername }))
    .catch((error) => {
      console.log(error)
      console.log('string', error.toString())
      console.log('toJSON', error.toJSON())
      console.log('stringify', JSON.stringify(error))
      res.status(400).json({
        message: 'Could not change username',
        error
      })
    })
}

export default {
  changeUsername
}
