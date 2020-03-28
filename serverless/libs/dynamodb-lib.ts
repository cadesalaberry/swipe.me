import { DynamoDB } from 'aws-sdk'

function call (action, params) {
  console.log(process.env)
  const dynamoDb = new DynamoDB.DocumentClient({
    ...process.env.NODE_ENV === 'development' ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : {}
  })

  return dynamoDb[action](params).promise()
}

export default {
  call,
}

