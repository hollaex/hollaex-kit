import { commandTimings } from 'cypress-timings'
commandTimings()
import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{
           
      cy.visit(Cypress.env('LOGIN_PAGE'))
   
})

When ('I enter credentials Username,Password',()=>{
             
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env("USER0"))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
   
     
})

Then ('I should be able to view {string} market within {float} ms',(market,timeRange)=>{
     
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     
    
     cy.contains('Pro trade').click()
     cy.contains(market).click()
     const t0 = performance.now()
     // Wait for the element to appear with a dynamic identifier
     cy.get('[id^="tradingview_"]', { timeout: 5000 }) // Adjust the timeout as needed
     .should('be.visible') // Ensure it's visible
     .then(($element) => {
     // Log the dynamically generated identifier
     const dynamicId = $element.attr('id');
     cy.log(`Found element with dynamic ID: ${dynamicId}`);

 // Now you can interact with the element as needed

     cy.get(`#${dynamicId}`).click()
     const t1 = performance.now()
     const time = t1-t0;
     cy.log('time')
     cy.log(t1-t0)
     cy.log(time,timeRange)
     expect(time).to.be.lessThan(timeRange)
 
       });
})

