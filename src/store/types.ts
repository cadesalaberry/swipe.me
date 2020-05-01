
export interface UserAttributes {
  email: string;
  // eslint-disable-next-line camelcase
  email_verified: string;
  sub: string;
}

export interface UserInformations {
  attributes: UserAttributes;
}

export interface Card {
  title: string;
  description: string;
  // eslint-disable-next-line camelcase
  picturePath: string;
}

export interface Deck {
  deckHandle: string;
  deckId: string;
  cards: Array<Card>;
  createdAt: number;
}
export interface NewDeck {
  deckHandle: string;
  cards: Array<Card>;
}
