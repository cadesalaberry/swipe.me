'use strict'

const AWS = require('aws-sdk')
const Promise = require('bluebird')
let DYNAMODB_CONFIG = { region: 'eu-west-3' }

if (process.env.NODE_ENV !== 'prodution') {
  DYNAMODB_CONFIG = {
    endpoint: 'http://localhost:8000',
    region: 'localhost'
  }
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(DYNAMODB_CONFIG)

const getInteractionEventHistory = async (event, context) => {
  const dynamoScan = Promise.promisify(dynamoDb.scan, {
    context: dynamoDb
  })
  const payload = {
    TableName: process.env.DYNAMODB_TABLE
  }

  return dynamoScan(payload)
    .then((o) => {
      return {
        statusCode: 200,
        body: JSON.stringify(o)
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error processing the request',
          error: err
        })
      }
    })
}

const getMyInteractionEventHistory = async (event, context) => {
  const params = event.queryStringParameters
  const dynamoQuery = Promise.promisify(dynamoDb.query, {
    context: dynamoDb
  })
  const payload = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': params.userId
    }
  }

  return dynamoQuery(payload)
    .then((o) => {
      return {
        statusCode: 200,
        body: JSON.stringify(o)
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error processing the request',
          error: err
        })
      }
    })
}

const recordInteractionEvent = async (event) => {
  const dynamoPut = Promise.promisify(dynamoDb.put, {
    context: dynamoDb
  })
  let body = {}

  try {
    body = JSON.parse(event.body)
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON body',
        error: error
      })
    }
  }

  const payload = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      userId: body.userId,
      fingerprint: body.fingerprint,
      actionName: body.actionName,
      cardId: body.cardId
    }
  }

  return dynamoPut(payload)
    .then((o) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Event logged successfully!',
          payload: o
        })
      }
    })
    .catch((err) => {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Error processing the request',
          error: err
        })
      }
    })
}

module.exports = {
  getMyInteractionEventHistory,
  getInteractionEventHistory,
  recordInteractionEvent
}
