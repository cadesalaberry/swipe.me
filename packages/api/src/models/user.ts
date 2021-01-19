import { CognitoIdentityServiceProvider } from 'aws-sdk'
import asyncPool from 'tiny-async-pool'
import Namer from '@swipeme.io/common/namer'

import { getConfig } from '../config'
import dynamoDb from '../libs/dynamodb-lib'
import BackError from '../libs/back.error'

import type { DeleteItemInput, DocumentClient, PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb'
import httpStatus from 'http-status'

interface ChangeUsernameReply {
  oldPreferredUsername: string;
  newPreferredUsername: string;
  username: string;
}

const SINGLE_TABLE = process.env.SINGLE_TABLE || ''
const USERNAME_ZERO = process.env.USERNAME_ZERO || ''
const RESERVED_USERNAMES = [
  'login',
  'profile',
  'decks'
]

const validateUsername = (username: string) => {
  if (!username) throw new Error('Username cannot be empty')
  if (Namer.sanitizeHandle(username) !== username) throw new Error('Username contains invalid characters')
  if (RESERVED_USERNAMES.includes(username)) throw new Error('Username is reserved')
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

const changeUsername = async (username: string, newPreferredUsername: string): Promise<ChangeUsernameReply> => {
  const { cognitoRegion, cognitoUserPoolId } = getConfig()
  const cognitoIdServiceProvider = new CognitoIdentityServiceProvider({
    region: cognitoRegion
  })
  const updateUserAttributes = (
    newAttributes: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest
  ): CognitoIdentityServiceProvider.AdminUpdateUserAttributesResponse => new Promise((resolve, reject) => {
    cognitoIdServiceProvider.adminUpdateUserAttributes(newAttributes, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
  const getOldPreferredUsername = (username: string) => new Promise<string|undefined>((resolve, reject) => {
    const params: CognitoIdentityServiceProvider.Types.AdminGetUserRequest = {
      UserPoolId: cognitoUserPoolId,
      Username: username
    }
    cognitoIdServiceProvider.adminGetUser(params, (err, data) => {
      if (err) return reject(err)
      const attributes = data.UserAttributes || []
      const [attribute] = attributes.filter((o) => o.Name === 'preferred_username')
      const preferredUsername = attribute?.Value

      return resolve(preferredUsername)
    })
  })

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

  await validateUsername(newPreferredUsername)

  const entries = await getAllEntriesForUsername(newPreferredUsername)
  const isUsernameZero = newPreferredUsername === USERNAME_ZERO

  if (!isUsernameZero && entries?.length) throw new BackError('This username is already taken', httpStatus.CONFLICT)

  const oldPreferredUsername = await getOldPreferredUsername(username) || ''
  const oldEntries = oldPreferredUsername
    ? await getAllEntriesForUsername(oldPreferredUsername)
    : []

  await updateUserAttributes(params)

  await addAllEntriesToUsername(oldEntries, newPreferredUsername)
    .then(() => deleteAllEntries(oldEntries))

  return {
    username,
    newPreferredUsername,
    oldPreferredUsername
  }
}

export default {
  changeUsername
}
