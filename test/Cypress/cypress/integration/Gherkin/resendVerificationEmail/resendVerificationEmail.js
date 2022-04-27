import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = randomUsername+Cypress.env('NEW_USER')

Given ('I am on the Hollaex signup page',()=>{

      cy.visit(Cypress.env('SIGN_UP_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('.checkfield-input').should('not.be.checked')
      cy.get('[name="email"]').clear().type(username)
      cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('[name="password_repeat"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('.checkfield-input').should('be.enabled').check();
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should("not.be.always.exist")
      cy.get('.icon_title-text').should('contain', 'Email sent')
      cy.wait(5000)
})

When ('I ask for a resending verification email, I should be redirected to the related page',()=>{

     cy.get('.blue-link').should('contain','Request another one here')
     .click({force:true});
     cy.url().should('include', 'verify')
})

And ('I should be able to enter my email successfully',()=>{

    cy.get('.holla-button').should('not.be.enabled')
    cy.get('.input_field-input').type(username)
    cy.get('.holla-button').click({force:true});
    cy.contains('Resent Email').should('exist')
})

Then ('I should be redirected contact us page',()=>{

    cy.get('.holla-button').as('contact us').should('be.enabled').click({force:true})
    cy.get(':nth-child(3) > .holla-button')
    .should('be.enabled')
})