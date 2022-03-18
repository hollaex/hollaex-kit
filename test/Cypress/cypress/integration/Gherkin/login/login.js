import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('I enter credentials Username,Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env("USER0"))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should be able to login successfully',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
})

When ('I enter credentials Wrong Username,Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type('Iamnot@Iamnot.com')
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should not be able to login successfully and get error',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('exist') 
})

When ('I enter credentials Username,wrong Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('USER0'))
     cy.get('[name="password"]').clear().type('WrongPass123')
})

Then ('I should not be able to login successfully and get error',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('exist') 
})

When ('I enter credentials Frozen Username,Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('FROZEN'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should not be able to login successfully and get This account is frozen',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('contain','This account is frozen')
})