import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))

})

When ('I enter credentials to log in successfully',()=>{

    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
    cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
}) 

And ('I should be able to redirect to {string} page and cancel all open orders',(tradePage)=>{
   
    cy.contains('Pro trade').click()
    cy.contains(tradePage).click()
    cy.get('.app_bar-currency-txt').should('have.text', 'XHT/USDT:')
    //cy.get('[style="width: 801px; height: 390px; position: absolute; transform: translate(10px, 1210px);"] > .trade_block-wrapper > .trade_block-title > .justify-content-between > .d-flex > .trade_block-title-items > .edit-wrapper__container')
    cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-title > .justify-content-between > .d-flex > .trade_block-title-items > .edit-wrapper__container')
    .invoke('text').then(text => {
        var fullText = text;
        var pattern = /[0-9]+/g;
        var nmb = fullText.match(pattern);
        cy.wrap(nmb).as('openOrder')
        cy.log(nmb);
        cy.log('second', text)
        if (nmb > 0){
            cy.get('.trade__active-orders_cancel-All').click()
            cy.get(':nth-child(2) > .w-100 > :nth-child(3)').click()
        }          
        })
})

And ('I check the highest and lowest prices',()=>{
    cy.get('.trade_orderbook-depth').contains('0.01')
    cy.log('check lowest aks exist and click on the price will send the price')
    cy.get('.trade_orderbook-asks > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
    .as('lowestSell').should('be.visible')
    .click().then(function($elem) { cy.focused().should('have.value', $elem.text())
      })   
    cy.get('@lowestSell').should('be.visible')
    .click().then(function($elem) { cy.focused().should('have.value', $elem.text()) })
    cy.get('.trade_orderbook-asks')
    cy.get('.trade_orderbook-bids > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
    .should('be.visible').as('highestBuy')
    cy.get('.form-error').should('not.be.exist')
    cy.get('.trade_order_entry-form_fields-wrapper').click()
    cy.wallectCheck('sell','HollaEx',0.01,0,0.26)
    cy.wallectCheck('buy','USD Tether',0.01,0,0.26)
})

When ('I make buy orders {string} times',(orderTime)=>{

    cy.get('@highestBuy').click()
    for (var i = 1; i < Number(orderTime)+1; i++) 
      {
        cy.get('[name="price"]').type('{upArrow}').invoke('val')
        .then(text => {
             cy.log(text)
             cy.wrap(text).as('currentPrice')
        })
        cy.get('[name="size"]').clear().type(i)
        cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
        cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .buy')
        .contains('buy')
        cy.get('@currentPrice')
        .then(val=> {
            cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-content > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
            
            .should('contain', val)
        })
        cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
        .contains(i)                   
      }
})

When ('I make sell orders {string} times',(orderTime)=>{

    cy.get('.trade_order_entry-action_selector > :nth-child(2)').click()
    cy.get('@lowestSell').click()
     for (var i = 1; i < Number(orderTime)+1; i++) 
       {
         cy.get('[name="price"]').type('{downArrow}').invoke('val')
        .then(text => {
            cy.log(text)
            cy.wrap(text).as('currentPrice')
        })
        cy.get('[name="size"]').clear().type(i)
        cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
        cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
        .contains('sell')
        cy.get('@currentPrice')
        .then(val=> {
            cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-content > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
            .should('contain', val)
           // cy.get('.wallet-wrapper > :nth-child(2) > :nth-child(3)').click()
            // cy.contains('HOLLAEX', {matchCase: false}).click().log("wallet opened")//.pause()
        })
        cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
        .contains(i)         
       // cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(4)')      
       }
})

And ('I take sell orders {string} times',(orderTime)=>{
    cy.get('.trade_order_entry-action_selector > :nth-child(1)').click()
    for (var i = Number(orderTime); i>0; i--) 
        {
         // cy.get('@highestBuy')
          cy.get('.trade_orderbook-asks > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
          .click().invoke('text')
          .then(text => {
              cy.log(text)
              cy.wrap(text).as('currentPrice')
          })  
           cy.get('[name="size"]').clear().type(i)
           cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
           .contains('sell').wait(2000)
           cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)').first()
           .contains(i) 
           cy.get(':nth-child(1) > :nth-child(2) > .trade_history-row')
           .contains(i) 
           cy.get('@currentPrice')
           .then(val=> {
                cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(4)')
                .should('contain', val)
            })        
        }
})

And ('I take buy orders {string} times',(orderTime)=>{

    cy.get('.trade_order_entry-action_selector > :nth-child(2)').click()
    for (var i = Number(orderTime); i >0; i--) 
        {
        // cy.get('@lowestSell')
         cy.get('.trade_orderbook-bids > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
         .click().invoke('text')
         .then(text => {
              cy.log(text)
              cy.wrap(text).as('currentPrice')
          })     
         cy.get('[name="size"]').clear().type(i)
         cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
         cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .buy')
         .contains('buy').wait(2000)
         cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)').first()
         .contains(i) 
         cy.get(':nth-child(1) > :nth-child(2) > .trade_history-row')
         .contains(i) 
         cy.get('@currentPrice')
         .then(val=> {
            cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(4)')
            .should('contain', val)
        })       
    }
})

When ('I fill {string} of {string} in an order partially',(portion,whole)=>{
     
     let size = Number(whole)    
     cy.get('.trade_order_entry-action_selector > :nth-child(2)').click()
     cy.get('@lowestSell').click()
     cy.get('[name="price"]').type('{downArrow}').invoke('val')
     .then(text => {
          cy.log(text)
           cy.wrap(text).as('currentPrice')
      })
     cy.get('[name="size"]').clear().type(size)
     cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
     .contains('sell')
     cy.get('@currentPrice')
     .then(val=> {
         cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-content > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
         .should('contain', val)
         cy.wallectCheck('sell','HollaEx',0.01,size,val)
       })
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
     .contains(size) 
     cy.get('.trade_order_entry-action_selector > :nth-child(1)').click() 
     cy.get('[name="size"]').clear().type((size-Number(portion)))
     cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .buy')
     .contains('buy')
     cy.get('@currentPrice')
     .then(val=> {
          cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-content > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
          .should('contain', val)
          })
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)')
     .contains((size-Number(portion))) 
     cy.get(':nth-child(1) > :nth-child(2) > .trade_history-row')
     .contains((size-Number(portion)))
     cy.wait(2000)
       
})

Then ('I will see the {string} / {string} percentage',(portion,whole)=>{

    cy.get('.cell_value-wrapper').invoke('text').then(text => {
        var fullText = text;
        var pattern = /[0-9]+/g;
        var nmb = fullText.match(pattern);
        cy.log(nmb);
        cy.log(text).should('include','50 % Filled')
        expect(Number(nmb)).to.equal((Number(portion)/Number(whole))*100)
             
        })
    cy.wait(2000)
    cy.get('.trade__active-orders_cancel-All').click()
    cy.get(':nth-child(2) > .w-100 > :nth-child(3)').click()
    cy.wait(2000)
    cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-title > .justify-content-between > .d-flex > .trade_block-title-items > .edit-wrapper__container')
    .invoke('text').then(text => {
        var fullText = text;
        var pattern = /[0-9]+/g;
        var nmb = fullText.match(pattern);
        cy.wrap(nmb).as('openOrder')
        cy.log(nmb);
        cy.log('second', text)
        expect(Number(nmb)).to.equal(Number('0'))      
        })
})
