import { AWSError, DynamoDB } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

import type { PutItemInput, GetItemInput } from 'aws-sdk/clients/dynamodb'

function getInstance () {
  return new DynamoDB.DocumentClient({
    ...process.env.NODE_ENV === 'development' ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : {}
  })
}

function get (params: GetItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.get(params).promise()
}

function put (params: PutItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.put(params).promise()
}

export default {
  get,
  put
}
