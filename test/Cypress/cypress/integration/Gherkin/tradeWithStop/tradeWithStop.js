import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am on the Hollaex login page',()=>{
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.contains('24h Trade').click()
      cy.contains('XHT/USDT').click()
      cy.get('.app_bar-currency-txt').should('have.text', 'XHT/USDT:')
      // cy.wait(3000)
      // cy.get('.trade__active-orders-header_cancel-All').dblclick({force:true})
      // cy.get('.w-100 > :nth-child(3)').click({force:true})
      cy.contains('Regular').trigger('mouseover').click()
      cy.contains('Stops').trigger('mouseover').click();

      cy.get('.trade_orderbook-market-price').should('be.visible')
     .click().then(function($elem) { 
        cy.get(':nth-child(5) > .trade_input-input-wrapper > input').type(parseFloat($elem.text()))
     .get(':nth-child(7) > .trade_input-input-wrapper > input')
     .click().get(':nth-child(5) > .trade_input-input-wrapper > .warning_text')
     .should('be.always.exist')
     .get(':nth-child(5) > .trade_input-input-wrapper > input')
     .clear().type(parseFloat($elem.text())+0.1)
     .click().get(':nth-child(5) > .trade_input-input-wrapper > .warning_text')
     .should('not.be.always.exist')
     .get(':nth-child(7) > .trade_input-input-wrapper > input').type('1')
     .get('.holla-button').click().get('.form-error').should('not.be.always.exist')
     cy.get('.table_body-wrapper > :nth-child(1) > .px-2')
     .contains(parseFloat($elem.text())+0.1)
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .buy')
     .contains('buy')
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
     .contains($elem.text()) 
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
     .contains('1') 
       })

       cy.get('.trade_order_entry-action_selector > :nth-child(2)').click()
       cy.get('.trade_orderbook-market-price').should('be.visible')
     .click().then(function($elem) { 
        cy.get(':nth-child(5) > .trade_input-input-wrapper > input').clear().type($elem.text()).pause()
     .get(':nth-child(7) > .trade_input-input-wrapper > input')
     .click().get(':nth-child(5) > .trade_input-input-wrapper > .warning_text')
     .should('be.always.exist')
     .get(':nth-child(5) > .trade_input-input-wrapper > input')
     .clear().type(parseFloat($elem.text())).type('{downarrow}')//.pause()
     .click().get(':nth-child(5) > .trade_input-input-wrapper > .warning_text')
     .should('not.be.always.exist')
     .get(':nth-child(7) > .trade_input-input-wrapper > input').clear().type('1')
     .get('.holla-button').click().get('.form-error').should('not.be.always.exist')
     .get('.table_body-wrapper > :nth-child(1) > .px-2')
     .contains(parseFloat($elem.text()).toFixed(2)-0.01)
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
     .contains('sell')
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
     .contains($elem.text()) 
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
     .contains('1') 
       })
    })
When ('I enter credentials',()=>{})

And ('I should be able to login successfully',()=>{})

Then ('I cancel orders',()=>{})

Given ('I am on XHT-USDT trade page',()=>{})

When ('I make buy orders',()=>{})

Then ('I should be able to see orders',()=>{})

When ('I make sell orders',()=>{})

Then ('I should be able to see orders',()=>{})

