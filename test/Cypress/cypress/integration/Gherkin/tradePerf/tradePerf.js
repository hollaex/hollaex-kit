import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page as a trader',()=>{

    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env("Alice"))
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
}) 

And ('I should be able to redirect to {string} page and cancel all open orders',(tradePage)=>{
   
    cy.contains('Pro trade').click()
    cy.contains(tradePage).click()
    cy.get('.app_bar-currency-txt').should('have.text', 'XHT/USDT:')
    cy.get('.trade_block-wrapper > .trade_block-title > .justify-content-between > .d-flex > .trade_block-title-items > .edit-wrapper__container')
    .contains('Open orders')
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
    function clickUntilDepthIs01() {
        // Check if the condition is met
        cy.get('.trade_orderbook-depth').then(($depth) => {
          if ($depth.text().includes('0.01')) {
            // If the condition is met, then do nothing (or perform any necessary actions)
            return;
          } else {
            // If the condition is not met, click the element and call the function again
            cy.get('.trade_orderbook-depth-selector > :nth-child(3)').click();
            clickUntilDepthIs01(); // Recursively call the function
          }
        });
      }
      
      // Start the clicking process
      clickUntilDepthIs01();
      
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
    
})

When ('I make buy orders {string} times less than {float} second',(orderTime,timeRange)=>{
     let t0, t1, t2; // Declare t0 and t1 outside the loop
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
         cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
        .then(() => {
          t0 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t0);
        });
        cy.get('.open-order-wrapper > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > .table_body-row > :nth-child(3) > .buy')
        .contains('buy')
        .then(() => {
          t1 = performance.now();
          // You can use `t0` here for further actions or logging
          cy.log('Time recorded:', t1);
        });
        cy.get('@currentPrice')
        .then(val=> {
         cy.get('.open-order-wrapper > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > .table_body-row > :nth-child(5)')
          .should('contain', val)
        })
        cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
        .contains(i)                   
      }
      cy.then(() => {
      const time = (t1 - t0)/1000;
      cy.log(time,timeRange)
      expect(time).to.be.lessThan(timeRange)
    });
   
})


When ('I make sell orders {string} times less than {float} second',(orderTime,timeRange)=>{
     let t0, t1, t2; // Declare t0 and t1 outside the loop
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
        .then(() => {
          t0 = performance.now();
          // You can use `t0` here for further actions or logging
          cy.log('Time recorded:', t0);
        });
        cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
        .then(() => {
          t1 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t1);
        });
         //cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
         cy.get(':nth-child(1) > :nth-child(3) > .sell')
         .contains('sell')
         .then(() => {
          t2 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t1);
        });
         cy.get('@currentPrice')
         .then(val=> {
             //cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-content > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
             cy.get('.open-order-wrapper > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
             .should('contain', val)
            // cy.get('.wallet-wrapper > :nth-child(2) > :nth-child(3)').click()
             // cy.contains('HOLLAEX', {matchCase: false}).click().log("wallet opened")//.pause()
         })
         cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
         .contains(i)         
        // cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(4)')      
        }
        cy.then(() => {
        const time = (t2 - t1)/1000;
        cy.log(time,timeRange)
        expect(time).to.be.lessThan(timeRange)
      });
      
})

And ('I take sell orders {string} times less than {float} second',(orderTime,timeRange)=>{
  let t0, t1, t2; // Declare t0 and t1 outside the loop  
    function clickUntilDepthIs00001() {
      // Check if the condition is met
      cy.get('.trade_orderbook-depth').then(($depth) => {
        if ($depth.text().includes('0.00001')) {
          // If the condition is met, then do nothing (or perform any necessary actions)
          return;
        } else {
          // If the condition is not met, click the element and call the function again
          cy.get('.trade_orderbook-depth-selector > :nth-child(1)').click();
          clickUntilDepthIs00001(); // Recursively call the function
        }
      });
    }
    
  // Start the clicking process
  clickUntilDepthIs00001();
    
  cy.get('.trade_orderbook-depth').contains('0.00001')
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
         cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
         .then(() => {
          t0 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t0);
        });
         cy.get('.notification-content-wrapper > .holla-button').click()//notification
         .then(() => {
          t1 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t1);
        });
         cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
         .contains('sell')//.wait(2000)
         .then(() => {
          t2 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t2);
        });
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
      cy.then(() => {
        const time = (t2 - t1)/1000;
        cy.log(time,timeRange)
        expect(time).to.be.lessThan(timeRange)
    });
    

})

And ('I take buy orders {string} times less than {float} second',(orderTime,timeRange)=>{
    let t0, t1, t2; // Declare t0 and t1 outside the loop
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
         cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
         .then(() => {
          t0 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t0);
        });
         cy.get('.notification-content-wrapper > .holla-button')
         .click().then(() => {
          t1 = performance.now();
          // You can use `t1` here for further actions or logging
          cy.log('Time recorded:', t1);
        })
   
    }
      cy.then(() => {
        const time = (t1 - t0)/1000;
        cy.log(time,timeRange)
        expect(time).to.be.lessThan(timeRange)
  });

})

When ('I fill {string} of {string} in an order partially less than {float} second',(portion,whole,timeRange)=>{
     let t0, t1, t2; // Declare t0 and t1 outside the loop
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
     cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
     
     //cy.get('.notification-content-wrapper > .holla-button').click()//notification
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .sell')
     .contains('sell')
     cy.get('@currentPrice')
     .then(val=> {
        cy.get('.open-order-wrapper > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > .table_body-row > :nth-child(5)') 
        .should('contain', val)
         cy.wallectCheck('sell','HollaEx',0.01,size,val)
       })
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(6)')
     .contains(size) 
     cy.get('.trade_order_entry-action_selector > :nth-child(1)').click() 
     cy.get('[name="size"]').clear().type((size-Number(portion)))
     cy.get('.holla-button').click().get('.form-error').should('not.be.always.exist')
     cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click()
     .then(() => {
      t0 = performance.now();
      // You can use `t1` here for further actions or logging
      cy.log('Time recorded:', t0);
    });
    cy.get('.notification-content-wrapper > .holla-button').click()//notification
    // cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3) > .buy')
    cy.get(':nth-child(2) > .cell_box-type > .buy')
     .contains('buy')
     cy.get('@currentPrice')
     .then(val=> {
         // cy.get('[style="width: 801px; height: 430px; position: absolute; transform: translate(10px, 690px);"] > .trade_block-wrapper > .trade_block-content > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > :nth-child(1) > :nth-child(5)')
         cy.get('.open-order-wrapper > .trade_active_orders-wrapper > .table_container > .table-content > .table-wrapper > .table_body-wrapper > .table_body-row > :nth-child(5)')
         .should('contain', val)
          })
     cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(2)')
     .contains((size-Number(portion))) 
     .then(() => {
      t1= performance.now();
      // You can use `t1` here for further actions or logging
      cy.log('Time recorded:', t1);
    });
     cy.get(':nth-child(1) > :nth-child(2) > .trade_history-row')
     .contains((size-Number(portion)))
     .then(() => {
      t2 = performance.now();
      // You can use `t1` here for further actions or logging
      cy.log('Time recorded:', t2);
    });
    cy.then(() => {
    const time = (t2 - t1)/1000;
    cy.log(time,timeRange)
    expect(time).to.be.lessThan(timeRange)
  });

})

Then ('I will cancel the order of {string} / {string} percentage less than {float} second',(portion,whole,timeRange)=>{
  let t0, t1, t2; // Declare t0 and t1 outside the loop
    cy.get('.trade__active-orders_cancel-All').click()
    .then(() => {
      return cy.get(':nth-child(2) > .w-100 > :nth-child(3)').click();
    })
    .then(() => {
      t1 = performance.now();
      cy.log('Time recorded:', t1);
      return cy.get('.no-data > .edit-wrapper__container > :nth-child(1)');
    })
    .then(() => {
      t2 = performance.now();
      cy.log('Time recorded:', t2);
      const time = (t2 - t1) / 1000;
      cy.log(time, timeRange);
      expect(time).to.be.lessThan(timeRange);
    });
  
})
