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
    const currentDate = new Date();
    var timestampSaved = currentDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    cy.log(timestampSaved);
    



    cy.url().should('contain','account')
    cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
    .should('contain',Cypress.env('ADMIN_USER'))

    cy.contains('Security').click()
    cy.contains('Sessions').click()
    //cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)')
  // Assuming you have saved the timestamp in a variable named 'savedTimestamp'
  cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)').invoke('text').then((text) => {
    var timestampSystem = new Date(text).toLocaleString('en-US',{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
   cy.log(timestampSystem)
  

  const toleranceSeconds = 5; // Allow a difference of up to 5 seconds
 cy.log(timestampSaved,timestampSystem)
 const timestamp1 = new Date(timestampSaved);
const timestamp2 = new Date(timestampSystem);

const year1 = timestamp1.getFullYear();
const year2 = timestamp2.getFullYear();

const month1 = timestamp1.getMonth();
const month2 = timestamp2.getMonth();

const hour1 = timestamp1.getHours();
const hour2 = timestamp2.getHours();

const minute1 = timestamp1.getMinutes();
const minute2 = timestamp2.getMinutes();

expect(year1).to.equal(year2);
expect(month1).to.equal(month2);
expect(hour1).to.equal(hour2);
expect(minute1).to.equal(minute2);

   var diffInSeconds = Math.abs(timestamp1.getSeconds()- timestamp2.getSeconds()) / 1000; // Calculate the difference in seconds
  
  cy.log(diffInSeconds.toString());
  if (diffInSeconds <= toleranceSeconds) {
    cy.log('Timestamps are close together.');
  } else {
    cy.log('Timestamps are not close together.');
  }
});
})

Then ('I should be able to revoke ny current session successfully',()=>{
 cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)').click()
 cy.get(':nth-child(1) > .text-center > .d-flex > .pointer').click()
 cy.get('.edit-wrapper__container > .font-weight-bold')
 .contains('Are you sure you want to revoke and logout of this session?')
 cy.get(':nth-child(3) > .holla-button').click()
 cy.get(':nth-child(3) > .app-menu-bar-content-item > .edit-wrapper__container > :nth-child(1)').click()
 cy.contains('XHT/USDT').click()
 cy.get('.notification-content-information')
 .contains('Your session is expired. Please login again.')
 cy.get('.notification-content-wrapper > .holla-button').click()
 cy.url().should('include', '/login');
})