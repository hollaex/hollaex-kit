import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('I enter credentials {string},{string}',(username,password)=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('Alice'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should be able to login successfully',()=>{

    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
})

And ('I should be in {string} page with {string}',(account,username)=>{

    cy.url().should('contain','account')
    cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
    .should('contain',Cypress.env('Alice'))
})

Then ('I should be able to logout successfully',()=>{

     cy.contains('Signout').click()
     cy.url().should('contain','login')
})

And  ('I receive the notification Email',()=>{
    cy.task('getLastEmail', {
         user: Cypress.env('EMAIL_ADMIN'),
         password: Cypress.env('EMAIL_PASS'),
         host: Cypress.env('EMAIL_HOST'),
         port: 993,
         tls: true  })
         .then((emailContent) => {
         cy.extractText(emailContent).then((extractedText) => {
         cy.log(`Extracted Text: ${extractedText}`);
         expect(extractedText).to.include(Cypress.env("Alice"))
         expect(extractedText).to.include('We have recorded a login') 
         });
     
     });
})