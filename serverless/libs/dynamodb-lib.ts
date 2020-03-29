import { DynamoDB } from 'aws-sdk'

function call (action, params) {
  const dynamoDb = new DynamoDB.DocumentClient({
    ...process.env.NODE_ENV === 'development' ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : {}
  })

  return dynamoDb[action](params).promise()
}

export default {
  call,
}

