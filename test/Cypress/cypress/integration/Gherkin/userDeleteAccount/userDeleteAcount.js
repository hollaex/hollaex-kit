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
})

And ('I delete my account',()=>{
  cy.wait(3000)
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
  cy.contains('Input you security codes').wait(5000)

  cy.task('getLastEmail', {
    user: Cypress.env('EMAIL_ADMIN'),
    password: Cypress.env('EMAIL_PASS'),
    host: Cypress.env('EMAIL_HOST'),
    port: 993,
    tls: true  })
    .then((emailContent) => {
   // Use the custom command 'extractText'
    //  expect(emailContent).to.include('sandbox Security Verification')
    cy.extractText(emailContent).then((extractedText) => {
    cy.log(`Extracted Text: ${extractedText}`);
    cy.fixture('example')
      .then((user)=>{
      expect(extractedText).to.include(user.email)
    })
  
    // Use the custom command 'findFirstWordAfterOperation' within the callback
    cy.findFirstWordAfterMyWord(extractedText,'operation.').then((firstWord) => {
    cy.log(`First word after "operation.": ${firstWord}`);
    cy.get('.w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children')
    .type(firstWord)
  });
});
  cy.get('form.w-100 > .holla-button').click()
});
})
Then ('I will be kicked out',()=>{
  cy.wait(3000)
  cy.reload();
   // cy.wait(3000)
  // cy.contains('You have been logged out')
  // cy.get('.notification-content-wrapper > .holla-button').click()
  //cy.get('.notification-content-wrapper > .holla-button').contains("Login")
})

Given ('I log in as the deleted user name',()=>{
    cy.fixture('example')
      .then((user)=>{
      username = user.email
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(username)
      cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      
    })
})

Then ('I can not log in',()=>{
   cy.get('.warning_text').contains("User not found")
})
 
And ('Admin confirms the email is not valid anymore',()=>{
  cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
  cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
  cy.get('.holla-button').should('be.visible').should('be.enabled').click()
  cy.get('.warning_text').should('not.exist') 
  cy.contains('Operator controls').click()
  cy.contains('Users').click()
  cy.fixture('example')
  .then((user)=>{
   username = user.email
   cy.get(':nth-child(2) > .ant-input').clear().type(username)
   cy.get(':nth-child(2) > .ant-btn').click()
   cy.wait(5000)
   cy.get(':nth-child(8) > .ant-btn') .click()
   cy.get(':nth-child(2) > .align-items-center > :nth-child(4)')
   .contains(username+"_deleted")
  cy.contains('Unfreez')
   
  })
  

  
  
})

