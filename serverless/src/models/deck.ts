import dynamoDb from '../libs/dynamodb-lib'

// eslint-disable-next-line no-unused-vars
import type { Handler } from 'express'
// eslint-disable-next-line no-unused-vars
import type { AWSError } from 'aws-sdk'
// eslint-disable-next-line no-unused-vars
import type { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb'

const DECKS_TABLE = process.env.DECKS_TABLE || ''

const getDeckById: Handler = (req, res) => {
  const deckId = req.params.deckId
  const params = {
    TableName: DECKS_TABLE,
    Key: {
      deckId
    }
  }

  return dynamoDb
    .get(params as GetItemInput)
    .then((result) => {
      if (!result.Item) {
        return res.status(404).json({
          error: 'deck not found'
        })
      }

      const {
        deckId,
        deckHandle,
        cards
      } = result.Item

      return res.json({
        deckId,
        deckHandle,
        cards
      })
    })
    .catch((error) => {
      return res.status(400).json({
        error: 'Could not get deck',
        ...error
      })
    })
}

const createDeck: Handler = (req, res) => {
  const {
    deckId,
    deckHandle,
    cards
  } = req.body

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
    ConditionExpression: 'attribute_not_exists(deckId) and attribute_not_exists(deckHandle)'
  }

  return dynamoDb
    .put(params as PutItemInput)
    .then((reply) => {
      res.json({
        deckId,
        deckHandle,
        cards
      })
    })
    .catch((error: AWSError) => {
      res.status(400).json({
        error: 'could not create deck',
        ...error
      })
    })
}

export default {
  getDeckById,
  createDeck
}
