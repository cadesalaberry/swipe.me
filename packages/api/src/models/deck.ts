import * as UUID from 'uuid'
import dynamoDb from '../libs/dynamodb-lib'
import BackError from '../libs/back.error'

import type { DocumentClient, GetItemInput, PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb'
import type { Deck, NewDeck } from '@swipeme.io/common/types'

const DECKS_TABLE = process.env.DECKS_TABLE || ''

const getDeckFromDynamoItem = (item: DocumentClient.AttributeMap): Deck => {
  const {
    deckId,
    PK,
    SK,
    createdAt,
    cards
  } = item

  return {
    deckId,
    ownerHandle: dynamoDb.getUserHandleFromPK(PK),
    deckHandle: dynamoDb.getDeckHandleFromSK(SK),
    createdAt,
    cards
  }
}

const getDeckByHandle = (userHandle: string, deckHandle: string): Promise<Deck> => {
  const params = {
    TableName: DECKS_TABLE,
    Key: {
      PK: dynamoDb.getPKFromUserHandle(userHandle),
      SK: dynamoDb.getSKFromDeckHandle(deckHandle)
    }
  }

  return dynamoDb
    .get(params as GetItemInput)
    .then((result) => {
      if (!result.Item) {
        throw new BackError('deck not found', 404)
      }

      return getDeckFromDynamoItem(result.Item)
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDecksByUserHandle = (ownerHandle: string): Promise<Deck[]> => {
  const params = {
    TableName: DECKS_TABLE,
    KeyConditionExpression: 'PK = :ownerHandle AND begins_with ( SK, :sortKey )',
    Select: 'ALL_ATTRIBUTES',
    ExpressionAttributeValues: {
      ':ownerHandle': dynamoDb.getPKFromUserHandle(ownerHandle),
      ':sortKey': 'DECK#'
    }
  }

  return dynamoDb
    .query(params as QueryInput)
    .then((result) => {
      if (!result.Items) {
        throw new BackError('decks were not found', 404)
      }

      return result.Items.map(getDeckFromDynamoItem)
    })
}

const createDeck = ({ deckHandle, cards, ownerHandle }: NewDeck): Promise<Deck> => {
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
      SK: dynamoDb.getSKFromDeckHandle(deckId),
      PK: dynamoDb.getPKFromUserHandle(ownerHandle),
      deckHandle,
      cards,
      createdAt
    },
    ConditionExpression: 'attribute_not_exists(deckId) and attribute_not_exists(deckHandle)'
  }

  return dynamoDb
    .put(params as PutItemInput)
    .then(() => {
      return getDeckByHandle(ownerHandle, deckHandle)
    })
}

export default {
  getDecksByUserHandle,
  getDeckByHandle,
  createDeck
}
