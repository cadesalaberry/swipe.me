
export interface IUserAttributes {
  email: string;
  // eslint-disable-next-line camelcase
  email_verified: string;
  sub: string;
}

export interface IUserInformations {
  attributes: IUserAttributes;
}

export interface ICard {
  title: string;
  description: string;
  // eslint-disable-next-line camelcase
  picture_path: string;
}

export interface IDeck {
  deckHandle: string;
  deckId: string;
  cards: Array<ICard>;
  createdAt: number;
}
export interface INewDeck {
  deckHandle: string;
  cards: Array<ICard>;
}
