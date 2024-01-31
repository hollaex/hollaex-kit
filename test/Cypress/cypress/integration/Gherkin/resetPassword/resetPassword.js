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
    cy.get('.input_field-input').type(username)
    cy.get('.holla-button').should('be.enabled').click()
})

Then ('I should be redirected contact us page',()=>{

     cy.get('.button-margin > :nth-child(3)').as('contact us').should('be.enabled').click({force:true})
     cy.get(':nth-child(3) > .holla-button').as('contact support')
     .should('be.enabled')
})

When ('I confirm the transfer by Email',()=>{
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
     cy.get('.preview-title').contains('sandbox Reset Password Request');
     cy.fixture('example')
     .then((user)=>{
          cy.get('.giraffe-emailaddress-link').last().contains(user.email);
      })
     cy.get('iframe').then(($iframe) => {
       const $emailBody = $iframe.contents().find('body');
       cy.wrap($emailBody).as('emailBody');
     });
     cy.get('@emailBody')
       .find('a')
       .should('exist');
     cy.get('@emailBody')
       .contains('You have made a request to reset the password for your account.');
 
     // Get all the links with "https" protocol from the email body
     cy.get('@emailBody')
       .find('a')
       .then(($links) => {
         const httpsLinks = [];
         $links.each((index, link) => {
           const href = link.href;
           if (href && href.startsWith('https')) {
             httpsLinks.push(href);
           }
         });
         cy.wrap(httpsLinks[1]).as('httpsLink');
       });
 
     // Log the list of https links
     cy.get('@httpsLink')
       .then((httpsLink) => {
         console.log(httpsLink);
         cy.forceVisit(httpsLink);
       });
   

})
Then ('I receive a successful message',()=>{

    cy.contains('Set new password').should('exist')
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear().type('weakPassword')
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear().type('weakPassword')
    cy.contains('Invalid password. It has to contain at least 8 characters, at least one digit and one character.') 
    cy.get('.holla-button').should('be.disabled')

    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear().type('newHolla2021!')
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear().type('diffHolla2021!')
    cy.contains("Password don't match")
    cy.get('.holla-button').should('be.disabled')

    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear().type('newHolla2021!')
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear().type('newHolla2021!')
    cy.get('.holla-button').should('be.enabled').click()
    cy.contains('Success')
    cy.get('.holla-button').click()
})

Then ('I log in as the very new user name',()=>{
      
     cy.fixture('example')
     .then((user)=>{
     username = user.email
     
     
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(username)
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').contains('Incorrect credentials.') 
     cy.wait(5000)
     cy.get('[name="password"]').clear().type('newHolla2021!')
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist')
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .contains(username)
})
}) 