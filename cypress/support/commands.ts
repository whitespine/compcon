/* eslint-disable @typescript-eslint/no-namespace */


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get a Vuetify text input by its placeholder
       * @example cy.placeholder('Name')
      */
      placeholder(value: string): Chainable<Element>
    }
  }
}

Cypress.Commands.add('placeholder', { prevSubject: false }, (value) => {
  return cy.get('.v-text-field').contains(value).parent().find('input')
})

export {}