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
        deckHandle,
        cards
      } = result.Item

      res.json({
        deckId,
        deckHandle,
        cards
      })
    } else {
      res.status(404).json({
        error: 'deck not found'
      })
    }
  })
}

function createDeck (req, res) {
  const {
    deckId,
    deckHandle,
    cards
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
      deckId,
      deckHandle,
      cards
    }
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error)

      res.status(400).json({
        error: 'could not create deck'
      })
    }

    res.json({
      deckId,
      deckHandle,
      cards
    })
  })
}

module.exports = {
  getDeckById,
  createDeck
}
