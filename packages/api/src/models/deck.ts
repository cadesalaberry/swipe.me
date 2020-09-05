import * as UUID from 'uuid'
import dynamoDb from '../libs/dynamodb-lib'
import BackError from '../libs/back.error'

import type { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb'
import type { Deck, NewDeck } from '@swipeme.io/common/types'

const DECKS_TABLE = process.env.DECKS_TABLE || ''

const getDeckByHandle = (deckHandle: string): Promise<Deck> => {
  const params = {
    TableName: DECKS_TABLE,
    Key: {
      deckHandle
    }
  }

  return dynamoDb
    .get(params as GetItemInput)
    .then((result) => {
      if (!result.Item) {
        throw new BackError('deck not found', 404)
      }

      const {
        deckId,
        deckHandle,
        createdAt,
        cards
      } = result.Item

      return {
        deckId,
        deckHandle,
        createdAt,
        cards
      }
    })
}

const createDeck = ({ deckHandle, cards }: NewDeck): Promise<Deck> => {
  if (typeof deckHandle !== 'string') {
    throw new BackError('"deckHandle" must be a string', 400)
  }
  if (!Array.isArray(cards)) {
    throw new BackError('"cards" must be an array', 400)
  }
  if (cards.filter(c => c.description).length !== cards.length) {
    throw new BackError('a "description" must be provided for all cards', 400)
  }
  if (cards.filter(c => c.title).length !== cards.length) {
    throw new BackError('a "title" must be provided for all cards', 400)
  }
  const deckId = UUID.v1()
  const createdAt = Date.now()
  const params = {
    TableName: DECKS_TABLE,
    Item: {
      deckId,
      deckHandle,
      cards,
      createdAt
    },
    ConditionExpression: 'attribute_not_exists(deckId) and attribute_not_exists(deckHandle)'
  }

  return dynamoDb
    .put(params as PutItemInput)
    .then(() => {
      return {
        deckId,
        deckHandle,
        createdAt,
        cards
      }
    })
}

export default {
  getDeckByHandle,
  createDeck
}
