import jsQR from 'jsqr';
const chai = require('chai');
const expect = chai.expect;
import {Given, And, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = "tester+"+randomUsername+Cypress.env('NEW_USER')
var selector
var selector1
var XHTAddress 


Given ('an admin is logged in',()=>{
  cy.visit(Cypress.env('LOGIN_PAGE'))
  cy.get('.holla-button').should('be.visible').should('be.disabled')
  cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
  cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
  cy.get('.holla-button').should('be.visible').should('be.enabled').click()
  cy.get('.warning_text').should('not.exist')
})
When ('Admin create a new user',()=>{
  cy.contains('Operator controls').click()
  cy.contains('Users').click()
  cy.wait(3000)
  cy.get('table tbody tr:first')  // get the topmost row in the table
  .then($row => {
    const rowKey = parseInt($row.attr('data-row-key')) + 1; // get the current data-row
     selector = `[data-row-key="${rowKey}"] > :nth-child(5)`; // create a selector for 
     selector1 = `[data-row-key="${rowKey}"] > :nth-child(8) > .ant-btn > a`;
  cy.contains('Add new user').click()
  cy.get('#addUser_userEmail').clear().type(username)
  cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
  cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
  cy.get('[type="submit"]').click()
  cy.get(selector).contains(username); // get the row with the updated data-row-key at
   cy.get(selector1).click()
});
   cy.get(':nth-child(2) > .align-items-center > :nth-child(4)').contains(username)
   cy.get(':nth-child(3) > .about-info-content > :nth-child(2)').contains('Verified')

})
And ('Admin create a new XHT wallet address for the user',()=>{
  cy.contains('Balance').click()
  cy.get('[data-row-key="1"] > .ant-table-row-expand-icon-cell').click()
  cy.get('.ant-table-expanded-row > .ant-table-cell > :nth-child(1) > div')
  .contains('Not generated')
  cy.get('.generate-link').click()
  cy.contains('This will generate crypto address for this assets.')
  cy.get('.btn-container > :nth-child(2)').click()
  cy.contains('Check and confirm')
  cy.get('fieldset > :nth-child(2) > :nth-child(2)').contains('xht')
  cy.get('.btn-container > :nth-child(2)').click()
  cy.wait(4000)
  cy.get('.ant-table-expanded-row > .ant-table-cell > :nth-child(1) > div')
   .invoke('text')
   .then((text) => {
    const trimmedText = text.trim().replace('eth: ', '');
    XHTAddress = trimmedText
  cy.log(trimmedText);
  });
})


When ('the user logs in to Hollaex',()=>{
  cy.visit(Cypress.env('LOGIN_PAGE'))
  cy.get('.holla-button').should('be.visible').should('be.disabled')
  cy.get('[name="email"]').clear().type(username)
  cy.get('[name="password"]').clear().type(Cypress.env("PASSWORD"))
  cy.get('.holla-button').should('be.visible').should('be.enabled').click()
  cy.get('.warning_text').should('not.exist') 

})
Then ('the user wallet address should be the same as the one created by the admin',()=>{
  cy.wait(3000)
  cy.visit(Cypress.env('XHT_LINK'))
  cy.get('[href="/wallet/xht/deposit"] > .holla-button').click()
  cy.get('.multiple-actions-wrapper > :nth-child(1)').click()
  cy.get('.blue-link')
  .should('have.text', XHTAddress);
  cy.get('canvas').then($canvas => {
    // Get the image data from the canvas
    const imageData = $canvas[0].getContext('2d').getImageData(0, 0, $canvas[0].width, $canvas[0].height);
    // Decode the barcode using jsQR
    const decodedData = jsQR(imageData.data, imageData.width, imageData.height);
    // Extract the XHT address from the decoded data
    const Address = XHTAddress;
    // Assert that the decoded data matches the XHT address
    cy.log(decodedData.data)
    expect(decodedData.data).to.equal(Address);
  });
});



   
     
     

 
 