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

function getUserHandleFromPK (PK: string): string {
  if (!PK.startsWith('USER#')) throw new Error(`${PK} is not a valid Primary Key`)

  return PK.replace('USER#', '')
}

function getPKFromUserHandle (userHandle: string): string {
  return `USER#${userHandle}`
}

function getDeckHandleFromSK (SK: string): string {
  if (!SK.startsWith('DECK#')) throw new Error(`${SK} is not a valid Sort Key`)

  return SK.replace('DECK#', '')
}

function getSKFromDeckHandle (deckHandle: string): string {
  return `DECK#${deckHandle}`
}

export default {
  get,
  put,
  query,
  scan,
  getUserHandleFromPK,
  getDeckHandleFromSK,
  getPKFromUserHandle,
  getSKFromDeckHandle
}
