describe('My First Test', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('Select Language From the dropdown', () => {
        cy.get('.language-select').select('hi')
        cy.url().contains('hi')
    })
  })