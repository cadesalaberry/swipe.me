import type { DocumentClient } from 'aws-sdk/clients/dynamodb'

import type { Deck } from './types'

const getDeckFromDynamoItem = (item: DocumentClient.AttributeMap): Deck => {
  const {
    PK,
    SK,
    title,
    createdAt,
    cards
  } = item

  return {
    ownerHandle: getUserHandleFromPK(PK),
    deckHandle: getDeckHandleFromSK(SK),
    createdAt,
    title,
    cards
  }
}

function getUserHandleFromPK (PK: string): string {
  if (!PK.startsWith('USER#')) throw new Error(`${PK} is not a valid Primary Key`)

  return PK.replace('USER#', '')
}

function getPKFromUserHandle (userHandle: string): string {
  return `USER#${userHandle}`
}

function getDeckHandleFromSK (SK: string): string {
  if (!SK.startsWith('DECK#')) throw new Error(`${SK} is not a valid Sort Key`)

  return SK.replace('DECK#', '')
}

function getSKFromDeckHandle (deckHandle: string): string {
  return `DECK#${deckHandle}`
}

function sanitizeHandle (handle: string): string {
  return (handle || '').replace(/\s+/g, '-').replace(/[\W_-]+/g, '-').toLowerCase()
}

export const Namer = {
  getDeckFromDynamoItem,
  getUserHandleFromPK,
  getDeckHandleFromSK,
  getPKFromUserHandle,
  getSKFromDeckHandle,
  sanitizeHandle
}
