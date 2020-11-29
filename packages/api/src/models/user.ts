import { CognitoIdentityServiceProvider } from 'aws-sdk'

import { getConfig } from '../config'
import dynamoDb from '../libs/dynamodb-lib'

import type { Handler } from 'express'

const USERS_TABLE = process.env.USERS_TABLE || ''

const getUserById: Handler = (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: { S: req.params.userId }
    }
  }

  return dynamoDb
    .get(params)
    .then((result) => {
      if (!result.Item) {
        return res.status(404).json({
          error: 'User not found'
        })
      }

      const {
        userId,
        name
      } = result.Item

      res.json({
        userId,
        name
      })
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Could not get user',
        error
      })
    })
}

const createUser: Handler = (req, res) => {
  const {
    userId,
    name
  } = req.body

  if (typeof userId !== 'string') {
    res.status(400).json({
      error: '"userId" must be a string'
    })
  } else if (typeof name !== 'string') {
    res.status(400).json({
      error: '"name" must be a string'
    })
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name
    }
  }

  return dynamoDb.put(params)
    .then(() => {
      res.json({
        userId,
        name
      })
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Could not create user',
        error
      })
    })
}

const changeUsername: Handler = async (req, res) => {
  const { cognitoRegion, cognitoUserPoolId } = getConfig()
  const cognitoIdServiceProvider = new CognitoIdentityServiceProvider({
    region: cognitoRegion
  })

  const {
    oldUsername,
    newUsername
  } = req.body

  const params = {
    UserAttributes: [
      {
        Name: 'preferred_username',
        Value: newUsername
      }
    ],
    UserPoolId: cognitoUserPoolId,
    Username: oldUsername
  }

  return new Promise((resolve, reject) => {
    cognitoIdServiceProvider
      .adminUpdateUserAttributes(params, (err, data) => {
        if (err) return reject(err)
        return resolve(data)
      })
  })
    .then(() => res.json({ oldUsername, newUsername }))
    .catch((error) => {
      res.status(400).json({
        message: 'Could not change username',
        error
      })
    })
}

export default {
  changeUsername,
  getUserById,
  createUser
}
