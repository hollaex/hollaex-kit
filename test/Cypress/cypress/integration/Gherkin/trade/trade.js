
import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

    Given ('I am in the Hollaex login page',()=>{

        cy.visit(Cypress.env('LOGIN_PAGE'))
                   
    })
When ('I enter credentials',()=>{

  cy.get('.holla-button').should('be.visible').should('be.disabled')
  cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
  cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))

  cy.get('.holla-button').should('be.visible').should('be.enabled').click()
  cy.get('.warning_text').should('not.exist') 
  cy.url().should('contain','account')
  cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
  .should('contain',Cypress.env('ADMIN_USER'))
  cy.contains('24h Trade').click()
  cy.contains('XHT/USDT').click()
  cy.get('.app_bar-currency-txt').should('have.text', 'XHT/USDT:')
}) 

And ('I should be able to login successfully',()=>{ 

})

Then ('I cancel orders',()=>{
  // cy.get('.trade__active-orders_cancel-All').click()
  // cy.get(':nth-child(2) > .w-100 > :nth-child(3)').click()
})


When ('I make buy orders',()=>{

  cy.get('.trade_orderbook-asks > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
  .should('be.visible')
  .click().then(function($elem) { cy.focused().should('have.value', $elem.text())
    })
    cy.get('.trade_orderbook-asks > :nth-child(1) > .d-flex > .trade_orderbook-cell-amount')
  .should('be.visible')
  .click().then(function($elem) { cy.focused().should('have.value', $elem.text())
    })
    // cy.get('.form-error').should('not.be.exist')
    cy.get('.trade_order_entry-form_fields-wrapper').click()
    for (var i = 1; i < 2; i++) 
      {
           
        cy.get('[name="size"]').clear().type(i).get('.text-price').first()
        .then(function($elem) { cy.log ($elem.text())})
          .get(':nth-child(5)').find('input').first().focus().clear().type(i).log(i+' clicked')//.pause()
           .get('.holla-button').click().get('.form-error').should('not.be.always.exist')
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .buy')
           .contains('buy')
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)').last()
           .contains(i).log(i)
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
           .contains(i).log(i)
                                         
      }
})

Then ('I should be able to see orders',()=>{})

Given ('I am in XHT-USDT trade page',()=>{})

When ('I make sell orders',()=>{

  cy.get('.trade_orderbook-bids > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
  .should('be.visible')
  .click().then(function($elem) { cy.focused().should('have.value', $elem.text())
    })
    cy.get('.trade_orderbook-bids > :nth-child(1) > .d-flex > .trade_orderbook-cell-amount')
  .should('be.visible')
  .click().then(function($elem) { cy.focused().should('have.value', $elem.text())
    })
    cy.get('.form-error').should('not.be.exist')
    cy.get('.trade_order_entry-action_selector > :nth-child(2)').click()
    for (var i = 2; i < 4; i++) 
      {
           
        cy.get('[name="size"]').clear().type(i).get('.text-price').first()
        .then(function($elem) { cy.log ($elem.text())})
          .get(':nth-child(5)').find('input').first().focus().clear().type(i).log(i+' clicked')
           .get('.holla-button').click().get('.form-error').should('not.be.always.exist')
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
           .contains('sell')
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
           .contains(i) 
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
           .contains(i)         
           // .get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
           // .get('.ReactModal__Content').contains('CONFIRM').click()
        
                
      }
})


When ('I take buy orders',()=>{
  cy.get('.trade_order_entry-action_selector > :nth-child(2)').click({force:true})
  for (var i = 1; i < 2; i++) 
           {
           
             cy.get('[name="size"]').clear().type(i).get('.text-price').first()
             .then(function($elem) { cy.log ($elem.text())})
               .get(':nth-child(5)').find('input').first().focus().clear().type(i).log(i+' clicked')
                //.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
                // cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
                // .contains('sell')
                // cy.get(':nth-child(1) > :nth-child(1) > .trade_history-row')
                // .contains(i) 
                // cy.get(':nth-child(1) > :nth-child(1) > .trade_history-row')
                // .contains(i)         
                // .get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
                // .get('.ReactModal__Content').contains('CONFIRM').click()
             
                     
           }
           cy.get('.trade_order_entry-action_selector > :nth-child(1)').click()
          
})

Then ('I should be able to see these',()=>{})

When ('I take sell orders',()=>{
  cy.get('.trade_order_entry-action_selector > :nth-child(1)').click({force:true})
  for (var i = 2; i < 4; i++) 
  {
       
    cy.get('[name="size"]').clear().type(i).get('.text-price').first()
    .then(function($elem) { cy.log ($elem.text())})
      .get(':nth-child(5)').find('input').first().focus().clear().type(i).log(i+' clicked')
       .get('.holla-button').click().get('.form-error').should('not.be.always.exist')
       // cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
       // .contains('sell')
      //  cy.get(':nth-child(1) > :nth-child(1) > .trade_history-row')
      //  .contains(i) 
      //  cy.get(':nth-child(1) > :nth-child(1) > .trade_history-row')
      //  .contains(i)         
       // .get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
       // .get('.ReactModal__Content').contains('CONFIRM').click()
    
            
  }
})

