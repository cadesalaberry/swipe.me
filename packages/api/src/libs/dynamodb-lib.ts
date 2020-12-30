import { AWSError, DynamoDB } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

import type { PutItemInput, GetItemInput, QueryInput, ScanInput } from 'aws-sdk/clients/dynamodb'

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

function query (params: QueryInput): Promise<PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.query(params).promise()
}

function scan (params: ScanInput): Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.scan(params).promise()
}

export default {
  get,
  put,
  query,
  scan
}
