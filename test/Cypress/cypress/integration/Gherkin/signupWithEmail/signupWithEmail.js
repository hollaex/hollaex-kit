import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = 'tester+'+randomUsername+Cypress.env('NEW_USER')

Given ('I am in Hollaex signup page',()=>{

      cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
      cy.visit(Cypress.env('SIGN_UP_PAGE'))
})

When ('I fill up the form',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('.checkfield-input').should('not.be.checked')
     cy.get('[name="email"]').clear().type(username)
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('[name="password_repeat"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.checkfield-input').should('be.enabled').check();
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should("not.be.always.exist")
})

Then ('I get a success notification',()=>{

     cy.get('.icon_title-text').should('contain', 'Email sent')
     cy.wait(5000)
})
   
When ('I confirm the registration by Email',()=>{

  cy.task('getLastEmail', {
    user: Cypress.env('EMAIL_ADMIN'),
    password: Cypress.env('EMAIL_PASS'),
    host: Cypress.env('EMAIL_HOST'),
    port: 993,
    tls: true  })
    .then((emailContent) => {
     cy.extractText(emailContent).then((extractedText) => {
     cy.log(`Extracted Text: ${extractedText}`);
       expect(extractedText).to.include(username)
       expect(extractedText).to.include('You need to confirm your email account by clicking the button below.');
     cy.findFirstHyperlinkAfterMyWord(extractedText,'[')
      .then((link) => {
       cy.forceVisit(link.slice(0, -1)); });
     }) ;})
     cy.contains('Confirm Sign Up').should('exist')
     cy.contains('CONFIRM SIGN UP').click()
     cy.contains('Success').should('exist')
     
 })

Then ('I am eligible to log in',()=>{})

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
 })

When ('I enter credentials',()=>{

   cy.fixture('example')
   .then((user)=>{
         cy.get('[name="email"]').clear().type(user.email)
         cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
         cy.get('.holla-button').should('be.visible').should('be.enabled').click()
         cy.get('.warning_text').should('not.exist') 
      })
}) 

Then ('I should be able to login successfully and Verification email should be the same',()=>{

   cy.fixture('example')
   .then((user)=>{
        cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
        .should('contain', user.email )
        cy.contains('Verification').click()
        cy.contains('Email').click()
        cy.get('.information-content').should('contain', user.email )
        cy.writeFile('cypress\\fixtures\\example.json', {})
   })
})