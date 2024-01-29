import { commandTimings } from 'cypress-timings'
commandTimings()
import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{
     const t0 = performance.now();
       
      cy.visit(Cypress.env('LOGIN_PAGE'))
   
})

When ('I enter credentials Username,Password',()=>{
     const t0 = performance.now();
         
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env("USER0"))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     const t1 = performance.now();
     cy.log('time')
     cy.log(t1-t0)
})

Then ('I should be able to view the wallet balances within {float} ms',(timeRange)=>{
     
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     
    
     cy.contains('Wallet').click()
     cy.get('.mb-2')
    //.should('exist') // Assert that the element initially exists
    .should('be.visible').then(($t0) => {; // Assert that the element is visible
    const t0 = performance.now();
  // After waiting for some time or performing some actions, the element should disappear
  // After waiting or taking actions, assert that the element no longer exists
  cy.get('.mb-2').should('not.exist')
//  cy.contains('Estimated Total Balance')
 .then(($t0) => {;
  const t1 = performance.now();
  const time = t1-t0;
  cy.log('time')
  cy.log(t1-t0)
  cy.log(time,timeRange)
  expect(time).to.be.lessThan(timeRange)
})})
})

