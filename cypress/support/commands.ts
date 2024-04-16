// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    selectValueFromDropdown(selector:string, value:string): typeof selectValueFromDropdown;
    checkValueInDropdown(selector:string, value:string): typeof checkValueInDropdown;
  }
}
//
function selectValueFromDropdown(selector:string, value:string):void {
    cy.get(selector)
      .click()
      .get("ng-dropdown-panel")
      .get(".ng-option")
      .contains(value)
      .then((item) => {
        cy.wrap(item).click();
      });
  }

  function checkValueInDropdown(selector:string, value:string):void {
    cy.get(selector)
      .click()
      .get("ng-dropdown-panel")
      .get(".ng-option")
      .contains(value)
  }
//
// NOTE: You can use it like so:
Cypress.Commands.add('selectValueFromDropdown', selectValueFromDropdown);
Cypress.Commands.add('checkValueInDropdown', checkValueInDropdown);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
