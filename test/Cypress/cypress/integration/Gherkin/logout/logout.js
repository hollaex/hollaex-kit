import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('I enter credentials {string},{string}',(username,password)=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
})

Then ('I should be able to login successfully',()=>{

    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
})

And ('I should be in {string} page with {string}',(account,username)=>{

    cy.url().should('contain','account')
    cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
    .should('contain',Cypress.env('ADMIN_USER'))
})

Then ('I should be able to logout successfully',()=>{

     cy.contains('Signout').click()
     cy.url().should('contain','login')
})