import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const number = `${Math.floor(Math.random() * 11)+2}`

Given ('Admin logged in and find "userlevel@testsae.com"',(userlevelATtestsaeDOTcom)=>{

    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
    cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
    cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
    .should('contain',Cypress.env('ADMIN_USER'))
    cy.contains('Operator controls').click()
    cy.contains('Users').click({force: true})
    cy.get('.ant-input').type(Cypress.env('LEVEL_NAME'))
    cy.get('.ant-btn').click()
})

When ('Choose new level  in the range of "1" to "11"',(one,eleven)=>{
    
    cy.get('.ml-4 > .ant-btn').click()
    cy.log(number)
    cy.get('.ant-select-selector').click().type('{downArrow}'.repeat(number)+'{enter}')
    cy.get('.ant-select-selection-item > .asset-list > .select-coin-text')
    .invoke('text').then(text => {
    var fullText = text;
    var pattern = /[0-9]+/g;
    var nmb = fullText.match(pattern);
    cy.wrap(nmb).as('tier')
    cy.log(nmb);
    cy.log('second', text)          
      })
   cy.contains('Update').click()
})

And  ('Admin confirms the level for a user "userlevel@testsae.com"',(userlevelATtestsaeDOTcom)=>{
   
    cy.get('@tier')
    .then(val => {
        cy.get('.user-level-container > .user-info-label').should('contain',val)
        cy.log('second', val)           
                                })
    cy.get(':nth-child(2) > .sidebar-menu').click()
})

Then ('The user profile page of "userlevel@testsae.com" should present the level',(userlevelATtestsaeDOTco)=>{

    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env('LEVEL_NAME'))
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
    cy.get('@tier')
    .then(val => {
         cy.get('.trader-account-wrapper > .w-100 > .align-items-center > :nth-child(2) > .summary-block-title')
         .should('contain',val)
         cy.log('second', val)           
    })
})
