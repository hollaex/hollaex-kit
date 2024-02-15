import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");
const randomUsername = Math.random().toString(36).substring(2,6);
var username = "tester+"+randomUsername+Cypress.env('NEW_USER')


Given ('Admin creats a user with a random username and the current password',()=>{
      
      cy.log(username);
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.contains('Operator controls').click()
      cy.contains('Users').click()
      cy.contains('Add new user').click()
      cy.get('#addUser_userEmail').clear().type(username)
      cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
      cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
      cy.get('[type="submit"]').click()
   cy.wait(3000)
    cy.contains(username)

}) 

Then ('The new username is stored',()=>{

     cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
}) 

Given ('I log in as the new user name',()=>{
      
      cy.fixture('example')
      .then((user)=>{
      username = user.email
      
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(username)
      cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
})
cy.contains('Settings').click()
cy.get('.tab_controller-tabs > :nth-child(6) > .edit-wrapper__container > :nth-child(1)').click()
cy.get('.edit-wrapper__container > :nth-child(1) > .underline-text').click()
cy.contains('Deleting your account will make both your account and funds inaccessible.')
cy.get('.danger-zone > .d-flex > :nth-child(2) > .edit-wrapper__container > :nth-child(1)')
.click()
cy.contains('Delete Account')
cy.get('.w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
.type('I UNDERSTANDn')
cy.get(':nth-child(3) > .holla-button').should('be.disabled')
cy.get('.w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
.clear().type('I UNDERSTAND')
cy.get(':nth-child(3) > .holla-button').should('be.enabled').click()
cy.contains('Input you security codes')

cy.window().then((win) => {
    // Open a new tab/window
    win.open(Cypress.env('EMAIL_PAGE'));
  });
  
  // Switch to the newly opened tab
  cy.window().then((win) => {
    // Focus on the newly opened tab
    win.focus();
  });
  
  // Visit the URL in the new tab
  cy.visit(Cypress.env('EMAIL_PAGE'));
       // Login to the email account
       cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'));
       cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'));
       cy.get('#wdc_login_button').click();
   
       // Open the latest email in the inbox
       cy.get('#ext-gen52').click();
       cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
         .dblclick();
       cy.wait(5000);
   
       // Verify the email content
       cy.get('.preview-title').contains('sandbox Security Verification');
       cy.fixture('example')
       .then((user)=>{
            cy.get('.giraffe-emailaddress-link').last().contains(user.email);
        })

}) 