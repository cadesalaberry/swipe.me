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

  console.log(req.body)

  if (typeof deckId !== 'string') {
    return res.status(400).json({
      error: '"deckId" must be a string'
    })
  }
  if (typeof deckHandle !== 'string') {
    return res.status(400).json({
      error: '"deckHandle" must be a string'
    })
  }
  if (!Array.isArray(cards)) {
    return res.status(400).json({
      error: '"cards" must be an array'
    })
  }
  if (cards.filter(c => c.description).length !== cards.length) {
    return res.status(400).json({
      error: 'a "description" must be provided for all cards'
    })
  }
  if (cards.filter(c => c.title).length !== cards.length) {
    return res.status(400).json({
      error: 'a "title" must be provided for all cards'
    })
  }

  const params = {
    TableName: DECKS_TABLE,
    Item: {
      deckId,
      deckHandle,
      cards
    },
    ConditionExpression: 'attribute_not_exists(deckId)'
  }

  try {
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
  } catch (e) {
    res.status(400).json({
      error: 'could not create deck',
      details: e
    })
  }
}

module.exports = {
  getDeckById,
  createDeck
}
