/// <reference types="cypress" />

context('Deck', () => {
  /**
   *
   * @param {number} number index ox the card to get
   */
  function getCard (number) {
    return cy.get(`.card__container[index="${number}"]`)
  }

  /**
   *
   * @param {number} number index ox the card to move
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  function moveCard (number, x, y) {
    return getCard(number).parent().parent().parent()
      .trigger('pointerdown', { button: 0 })
      .trigger('pointermove', { clientX: x, clientY: y }).click({ force: true })
      .trigger('pointerup', { force: true })
  }

  beforeEach(() => {
    cy.visit('http://localhost:8080/cadesalaberry/banana')
  })

  it.skip('Should show the first card', () => {
    getCard(0).within(() => {
      // ends the current chain and yields null
      cy.get('.card__title').contains('Degree').end()

      // queries the entire table again
      cy.get('.card__description').contains('in Software Engineering at').end()
    })
  })

  it.skip('Should have the second card', () => {
    getCard(1).within(() => {
      // ends the current chain and yields null
      cy.get('.card__title').contains('C').end()

      // queries the entire table again
      cy.get('.card__description').contains('a simple file system in C').end()
    }).end()

    cy.percySnapshot()
  })

  it.skip('should drag the first card left', () => {
    moveCard(0, 10, 10)

    getCard(1).should('be.visible')
  })
})
