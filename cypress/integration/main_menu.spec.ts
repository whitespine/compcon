describe('Main Menu', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })

  it('shows all menu options', () => {
    [
      "COMPENDIUM",
      "PILOT ROSTER",
      "ENCOUNTER TOOLKIT",
      "CAMPAIGN MANAGER",
      "CONTENT MANAGER"
    ].forEach(item => cy.contains(
      new RegExp(item, "i")
    ).should('be.visible'))
  });

})