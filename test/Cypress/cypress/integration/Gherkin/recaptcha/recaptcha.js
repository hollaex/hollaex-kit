import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('wait 5 second',()=>{

     cy.wait(5000)
})

And ('reCaptcha appears',()=>{
     cy.get('.grecaptcha-logo > iframe').then($iframe => {
          const $body = $iframe.contents().find('body');
          cy.wrap($body).should('be.visible').then(() => {
            const rect = $iframe[0].getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
        
            // Check if center is within the visible viewport
            if (centerX >= 0 && centerX <= Cypress.config('viewportWidth') &&
                centerY >= 0 && centerY <= Cypress.config('viewportHeight')) {
              // Center is visible, attempt to trigger mouseover
              cy.wrap($body).trigger('mouseover', { clientX: centerX, clientY: centerY });
            } else {
              // Center is not visible
              cy.log('The center of the iframe is not visible in the viewport');
            }
          });
        });
})

Then ('I should be able to login successfully',()=>{
    
     cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .should('contain',Cypress.env('ADMIN_USER'))
})
