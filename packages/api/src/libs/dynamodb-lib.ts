import { AWSError, DynamoDB } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

import type {
  UpdateItemInput,
  PutItemInput,
  GetItemInput,
  QueryInput,
  ScanInput,
  DeleteItemInput
} from 'aws-sdk/clients/dynamodb'

function getInstance () {
  return new DynamoDB.DocumentClient({
    ...process.env.NODE_ENV === 'development'
      ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT }
      : {}
  })
}

function get (params: GetItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.get(params).promise()
}

function deleteItem (params: DeleteItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.delete(params).promise()
}

function put (params: PutItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.put(params).promise()
}

function update (params: UpdateItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWSError>> {
  const dynamoDb = getInstance()

  return dynamoDb.update(params).promise()
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
  delete: deleteItem,
  get,
  put,
  update,
  query,
  scan
}
