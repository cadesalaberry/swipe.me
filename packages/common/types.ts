
export interface User {
  email: string;
  // eslint-disable-next-line camelcase
  email_verified: string;
  sub: string;
  picture: string;
  // eslint-disable-next-line camelcase
  given_name: string;
  // eslint-disable-next-line camelcase
  family_name: string;
}

export interface Card {
  title: string;
  description: string;
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
