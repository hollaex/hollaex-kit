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
     cy.wait(10000)
})
   
When ('I confirm the registration by Email',()=>{

     cy.visit(Cypress.env('EMAIL_PAGE'))
 
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
     cy.get('.preview-title').contains('sandbox Sign Up');
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
       .contains('You need to confirm your email account by clicking the button below.');
 
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