import dynamoDb from '../libs/dynamodb-lib'

const USERS_TABLE = process.env.USERS_TABLE

function getUserById (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId
    }
  }

  return dynamoDb
    .call('get', params)
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
      console.log(error)

      res.status(400).json({
        error: 'Could not get user'
      })
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

  dynamoDb.call('put', params)
    .then(() => {
      res.json({
        userId,
        name
      })
    })
    .catch((error) => {
      console.log(error)

      res.status(400).json({
        error: 'Could not create user'
      })
    })
}

module.exports = {
  getUserById,
  createUser
}
