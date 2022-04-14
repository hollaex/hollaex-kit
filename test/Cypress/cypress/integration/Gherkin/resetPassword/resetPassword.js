import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am on the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('.holla-button').should('be.visible').should('not.be.enabled')//.click()
      cy.get('.warning_text').should('not.exist') 
})  

When ('I ask for resetting the password, I should be redirected to the related page',()=>{

     cy.get('.action_notification-text').click()
     cy.url().should('include', '/reset-password')
})

And ('I should be able to enter my email successfully',()=>{

    cy.get('.holla-button').should('not.be.enabled')
    cy.get('.input_field-input').type(Cypress.env('ADMIN_USER'))
    cy.get('.holla-button').should('be.enabled').click()
})

Then ('I should be redirected contact us page',()=>{

     cy.get('.button-margin > :nth-child(3)').as('contact us').should('be.enabled').click({force:true})
     cy.get(':nth-child(3) > .holla-button').as('contact support')
     .should('be.enabled')
})

