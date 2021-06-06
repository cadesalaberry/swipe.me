import dynamoDb from '../libs/dynamodb-lib'
import { Namer } from '@swipeme.io/common'
import BackError from '../libs/back.error'

import type {
  GetItemInput,
  UpdateItemInput,
  PutItemInput,
  QueryInput
} from 'aws-sdk/clients/dynamodb'
import type {
  Deck,
  DeckPayload
} from '@swipeme.io/common'

const SINGLE_TABLE = process.env.SINGLE_TABLE || ''

const validateDeck = ({ deckHandle, cards, ownerHandle, title }: DeckPayload) => {
  if (typeof deckHandle !== 'string') {
    throw new BackError('"deckHandle" must be a string', 400)
  }
  if (typeof ownerHandle !== 'string') {
    throw new BackError('"ownerHandle" must be a string', 400)
  }
  if (typeof title !== 'string') {
    throw new BackError('"title" must be a string', 400)
  }
  if (deckHandle !== Namer.sanitizeHandle(deckHandle)) {
    throw new BackError('"deckHandle" should be lowercase without special characters', 400)
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
}

const getDeckByHandle = (userHandle: string, deckHandle: string): Promise<Deck> => {
  const params = {
    TableName: SINGLE_TABLE,
    Key: {
      PK: Namer.getPKFromUserHandle(userHandle),
      SK: Namer.getSKFromDeckHandle(deckHandle)
    }
  }

  return dynamoDb
    .get(params as GetItemInput)
    .then((result) => {
      if (!result.Item) {
        throw new BackError('deck not found', 404)
      }

      return Namer.getDeckFromDynamoItem(result.Item)
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDecksByUserHandle = (ownerHandle: string): Promise<Deck[]> => {
  const params = {
    TableName: SINGLE_TABLE,
    KeyConditionExpression: 'PK = :ownerHandle AND begins_with ( SK, :sortKey )',
    Select: 'ALL_ATTRIBUTES',
    ExpressionAttributeValues: {
      ':ownerHandle': Namer.getPKFromUserHandle(ownerHandle),
      ':sortKey': 'DECK#'
    }
  }

  return dynamoDb
    .query(params as QueryInput)
    .then((result) => {
      if (!result.Items) {
        throw new BackError('decks were not found', 404)
      }

      return result.Items.map(Namer.getDeckFromDynamoItem)
    })
}

const createDeck = (deck: DeckPayload): Promise<Deck> => {
  validateDeck(deck)
  const { deckHandle, cards, ownerHandle, title } = deck

  const createdAt = new Date().toISOString()
  const params = {
    TableName: SINGLE_TABLE,
    Item: {
      PK: Namer.getPKFromUserHandle(ownerHandle),
      SK: Namer.getSKFromDeckHandle(deckHandle),
      title,
      cards,
      createdAt
    },
    ConditionExpression: 'attribute_not_exists(PK) and attribute_not_exists(SK)'
  }

  return dynamoDb
    .put(params as PutItemInput)
    .then(() => getDeckByHandle(ownerHandle, deckHandle))
}

const updateDeck = (deck: DeckPayload): Promise<Deck> => {
  validateDeck(deck)
  const { deckHandle, cards, ownerHandle, title } = deck

  const updatedAt = new Date().toISOString()
  const params = {
    TableName: SINGLE_TABLE,
    Key: {
      PK: Namer.getPKFromUserHandle(ownerHandle),
      SK: Namer.getSKFromDeckHandle(deckHandle)
    },
    UpdateExpression: 'set title = :t, cards=:cards, updatedAt=:updatedAt',
    ExpressionAttributeValues: {
      ':t': title,
      ':cards': cards,
      ':updatedAt': updatedAt
    },
    ReturnValues: 'UPDATED_NEW'
  }

  return dynamoDb
    .update(params as UpdateItemInput)
    .then(() => getDeckByHandle(ownerHandle, deckHandle))
}

export default {
  getDecksByUserHandle,
  getDeckByHandle,
  createDeck,
  updateDeck
}
