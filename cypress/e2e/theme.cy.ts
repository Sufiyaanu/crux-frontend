describe('Check for Schema Details', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('Change Theme of the document', () => {
        cy.get('#themeBtn').click()
        cy.root().should('have.attr','data-theme').should('eq','dark')
    })
  })