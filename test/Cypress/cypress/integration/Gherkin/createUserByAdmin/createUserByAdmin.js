import {Given, And, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = "tester+"+randomUsername+Cypress.env('NEW_USER')
let selector;
let selector1;

Given ('I am logged in as an admin',()=>{
  cy.visit(Cypress.env('LOGIN_PAGE'))
  cy.get('.holla-button').should('be.visible').should('be.disabled')
  cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
  cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
  cy.get('.holla-button').should('be.visible').should('be.enabled').click()
  cy.get('.warning_text').should('not.exist') 
  })

When ('I navigate to the Create User page',()=>{
  cy.contains('Operator controls').click()
  cy.contains('Users').click()
  cy.contains('All Users').click()
  })

Then ('I should see a form for creating a new user',()=>{
  cy.contains('Add new user').click()
  })

When ('I try to create a user with an existing username',()=>{  
  cy.get('#addUser_userEmail').clear().type(Cypress.env('ALICE'))
  cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
  cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
  cy.get('[type="submit"]').click()
   })

Then ('I should see an error message of bad',()=>{
  cy.get('.ant-message-notice-content').contains('Bad')
  cy.wait(4000)
  })
    
When ('I try to create a user with an diffrent passwords',()=>{
  cy.get('.user-list-header-wrapper > .ant-btn').click()
  cy.get('#addUser_userEmail').clear().type(username)
  cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
  cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD')+"123")
  cy.get('[type="submit"]').click()
   })

Then ('I should see an error message',()=>{
  cy.get('.ant-message-notice-content').contains('Password and confirm password should be same')
  cy.wait(4000)
  })

When ('I fill out the form with valid user information',()=>{
       
  cy.get('table tbody tr:first')  // get the topmost row in the table
  .then($row => {
    const rowKey = parseInt($row.attr('data-row-key')) + 1; // get the current data-row-key attribute and add one to it
     selector = `[data-row-key="${rowKey}"] > :nth-child(5)`; // create a selector for the row with the updated data-row-key attribute
     selector1 = `[data-row-key="${rowKey}"] > :nth-child(8) > .ant-btn > a`;
  //cy.get('.user-list-header-wrapper > .ant-btn').click()
  cy.get('#addUser_userEmail').clear().type(username)
  cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
  cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
     });
  })
And ('I submit the form',()=>{
  cy.get('[type="submit"]').click()
  })

Then ('the user should be created successfully',()=>{
   cy.get(selector).contains(username); // get the row with the updated data-row-key attribute
 })
And ('I should see a success message',()=>{  cy.get(selector1).click()
   cy.get(':nth-child(2) > .align-items-center > :nth-child(4)').contains(username)
   cy.get(':nth-child(2) > .about-info-content > :nth-child(2)').contains('Verified')})

When ('a non-admin user tries to create a new user',()=>{
   const emailAddresses = [
     'tester+supervisor@hollaex.email',
     'tester+kyc@hollaex.email',
     'tester+communicator@hollaex.email',
     'tester+support@hollaex.email'
   ];
  const randomIndex = Math.floor(Math.random() * emailAddresses.length);
  const randomEmail = emailAddresses[randomIndex];
  cy.log(`Randomly chosen email address: ${randomEmail}`);
  cy.visit(Cypress.env('LOGIN_PAGE'))
  cy.get('.holla-button').should('be.visible').should('be.disabled')
  cy.get('[name="email"]').clear().type(randomEmail)
  cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
  cy.get('.holla-button').should('be.visible').should('be.enabled').click()
  cy.get('.warning_text').should('not.exist') 
         
  cy.contains('Operator controls').click()
  cy.contains('Users').click()
  cy.contains('All Users').click()
  cy.contains('Add new user').click()
  cy.get('#addUser_userEmail').clear().type(username)
  cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
  cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
  cy.get('[type="submit"]').click()
 })

Then ('they should be denied access',()=>{
  cy.get('.ant-message-notice-content').contains('Forbidden')
 })

             
   


  