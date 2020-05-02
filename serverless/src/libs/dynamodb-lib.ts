import { DynamoDB } from 'aws-sdk'

import type { PutItemInput, GetItemInput } from 'aws-sdk/clients/dynamodb'

function getInstance () {
  return new DynamoDB.DocumentClient({
    ...process.env.NODE_ENV === 'development' ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : {}
  })
}

function get (params: GetItemInput) {
  const dynamoDb = getInstance()

  return dynamoDb.get(params).promise()
}

function put (params: PutItemInput) {
  const dynamoDb = getInstance()

  return dynamoDb.put(params).promise()
}

export default {
  get,
  put
}
