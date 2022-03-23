import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('wait 5 second',()=>{

     cy.wait(5000)
})

And ('reCaptcha appears',()=>{
    
    cy.get('.grecaptcha-logo > iframe').click(({ force: true })).should('be.visible')
})

Then ('I should be able to login successfully',()=>{
    
     cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('ADMIN_USER'))
})
