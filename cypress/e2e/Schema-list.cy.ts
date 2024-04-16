describe('Schema lists', () => {

  // Test case to check the data from the API and WRT data functionality of the code.
  // Case 1 : If API returns empty response then the toast should display with message as "Data not found!" and nothing should be present in dropdown list
  // Case 2 : If API returns some data then the dropdown list should contains atleast first element from the API data.
  it('Check schema list Data is present or not', () => {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3003/bre-schema-list',
    }).as('schemaList')
    cy.visit('/')
    cy.wait('@schemaList').then((interception:any) => {
      if(interception?.response?.body?.data?.schemas == null || interception?.response?.body?.data?.schemas == null || interception?.response?.body?.data?.schemas.length == 0){
        cy.get('.toast-title').should('have.text',' Error ')
        cy.get('.toast-message').should('contain','Data not found!')
        cy.checkValueInDropdown('#app','No items found')
      }else{
        cy.checkValueInDropdown('#app',interception?.response?.body?.data?.schemas[0].app)
      }
    })
  })

})
   