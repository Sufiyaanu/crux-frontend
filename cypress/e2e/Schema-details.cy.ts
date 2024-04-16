describe('Schema lists', () => {

  // Test case to check the data from the API and WRT data functionality of the code.
  // Case 1 : If API returns empty response then the toast should display with message as "Data not found!" and schema tab should display message as "No schema details"
  // Case 2 : If API returns some data then the schema tabs should contains the data which is present in first attribute of the API.
  it('Show schema details', () => {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3003/bre-schema-get?app=Forex&slice=4&class=domesticrouting',
    }).as('schemaDetails')
    cy.visit('/')
    cy.selectValueFromDropdown('#app','Forex')
    cy.selectValueFromDropdown('#slice', '4')
    cy.selectValueFromDropdown('#class', 'domesticrouting')
    cy.wait('@schemaDetails').then((interception:any) => {
      if(interception?.response?.body?.data == null || interception?.response?.body?.data == undefined || Object.keys(interception?.response?.body?.data).length == 0){
        cy.get('.toast-title').should('have.text',' Error ')
        cy.get('.toast-message').should('contain','Data not found!')
        cy.get('#schema').contains('Details for the selected schema not found.')
      }else{
        cy.get('#schema').contains(interception?.response?.body?.data.patternschema.attr[0].name)
        cy.get('#schema').contains(interception?.response?.body?.data.patternschema.attr[0].valtype)
        cy.get('#schema').contains(interception?.response?.body?.data.patternschema.attr[0].longdesc)
      }
    })
    cy.get('#rulesets-tab').click();
  })

  // Error if schema details is not present
  it('Show error message as details is not found', () => {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3003/bre-schema-get?app=Stock&slice=1&class=domesticrouting',
    }).as('schemaDetails')
    cy.visit('/')
    cy.selectValueFromDropdown('#app','Stock')
    cy.selectValueFromDropdown('#slice', '1')
    cy.selectValueFromDropdown('#class', 'domesticrouting')
    cy.wait('@schemaDetails').then((interception:any) => {
      if(interception?.response?.body?.data == null || interception?.response?.body?.data == undefined || Object.keys(interception?.response?.body?.data).length == 0){
        cy.get('.toast-title').should('have.text',' Error ')
        cy.get('.toast-message').should('contain','Data not found!')
        cy.get('#schema').contains('Details for the selected schema not found.')
      }else{
        cy.get('#schema').contains(interception?.response?.body?.data.patternschema.attr[0].name)
        cy.get('#schema').contains(interception?.response?.body?.data.patternschema.attr[0].valtype)
        cy.get('#schema').contains(interception?.response?.body?.data.patternschema.attr[0].longdesc)
      }
    })
  })
})
   