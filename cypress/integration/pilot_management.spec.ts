describe('Pilot Roster', () => {
  it('successfully loads', () => {
    cy.visit('/pilot_management')
  })

})

describe('New Pilot Wizard', () => {
  it('can be accessed', () => {
    cy.visit('/pilot_management')
    cy.contains(/Add New Pilot/i).click()
    cy.contains(/Create New Pilot/i).parent().click()
    cy.contains(/New Pilot Registration/i).should('be.visible')
  })

  it('creates a pilot', () => {
    cy.placeholder('Name').type('John Doe')
    cy.placeholder('Callsign').type('TESTPILOT')

    // cy.scrollTo("bottom")a

    cy.placeholder('Background').type('Soldier')

    cy.get('.v-btn:visible').contains(/continue/i).click()

    for (let i = 0; i < 4; i++) {
      cy.get('.v-btn:has(.cci-accuracy):not([disabled])').eq(i).scrollIntoView().click()
    }

    cy.get('.v-btn:visible').contains(/continue/i).click()

    for (let i = 0; i < 3; i++) {
      cy.get('.v-btn:not([disabled]):contains(Unlock)').eq(i).scrollIntoView().click()
    }

    cy.get('.v-btn:visible').contains(/continue/i).click()

    cy.get('.v-btn:contains(add)').eq(0).click().click()
    cy.get('.v-btn:visible').contains(/continue/i).click()
    cy.contains(/Register new pilot/i).click()

  })

  it('adds pilot to the roster and redirects', () => {
    cy.url().should('include', '/pilot_management')
    cy.contains('TESTPILOT').should('be.visible')
  })

})