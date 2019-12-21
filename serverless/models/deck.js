const AWS = require('aws-sdk')

const DECKS_TABLE = process.env.DECKS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  ...process.env.IS_OFFLINE ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : {}
})

function getDeckById (req, res) {
  const params = {
    TableName: DECKS_TABLE,
    Key: {
      deckId: req.params.deckId
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error)

      res.status(400).json({
        error: 'Could not get deck'
      })
    }

    if (result.Item) {
      const {
        deckId,
        deckHandle
      } = result.Item

      res.json({
        deckId,
        deckHandle
      })
    } else {
      res.status(404).json({
        error: 'Deck not found'
      })
    }
  })
}

function createDeck (req, res) {
  const {
    deckId,
    deckHandle
  } = req.body

  if (typeof deckId !== 'string') {
    res.status(400).json({
      error: '"deckId" must be a string'
    })
  } else if (typeof deckHandle !== 'string') {
    res.status(400).json({
      error: '"deckHandle" must be a string'
    })
  }

  const params = {
    TableName: DECKS_TABLE,
    Item: {
      deckId: deckId,
      deckHandle: deckHandle
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
      deckId,
      deckHandle
    })
  })
}

module.exports = {
  getDeckById,
  createDeck
}
