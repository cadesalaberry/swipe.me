const AWS = require('aws-sdk')

const USERS_TABLE = process.env.USERS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  ...process.env.IS_OFFLINE ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : {}
})

function getUserById (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error)

      res.status(400).json({
        error: 'Could not get user'
      })
    }

    if (result.Item) {
      const {
        userId,
        name
      } = result.Item

      res.json({
        userId,
        name
      })
    } else {
      res.status(404).json({
        error: 'User not found'
      })
    }
  })
}

function createUser (req, res) {
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

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error)

      res.status(400).json({
        error: 'Could not create user'
      })
    }

    res.json({
      userId,
      name
    })
  })
}

module.exports = {
  getUserById,
  createUser
}
