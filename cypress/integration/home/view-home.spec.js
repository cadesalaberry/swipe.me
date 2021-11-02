/// <reference types="cypress" />

context('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  it('should show the homepage', () => {
    cy.get('.md-button-content').contains('Demo deck')
    cy.percySnapshot()
  })
})
