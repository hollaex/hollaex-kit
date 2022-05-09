import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");

Given ('Alice logged in successfully',()=>{
     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('ALICE'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(5000)
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('ALICE'))
}) 

And ('Alice has X amount of XHTT',()=>{
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.with_price-block_amount-value').invoke('text')
     .then(text => {
          var fullText = text;
           cy.writeFile('cypress\\fixtures\\AliceBalance.json', { name: 'XHTT', balance: fullText })
           cy.log('second', text)          
     })
     cy.contains('Signout').click()
}) 

When ('Bob logged in successfully',()=>{

     //cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('BOB'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(5000)
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
})

And ('Bob enables 2FA',()=>{

     cy.get('.app-menu-bar-side > :nth-child(5)').as('Car Keys').click()
     cy.get('.checkbutton-input-wrapper').as('enable').click()
     cy.get(':nth-child(3) > .otp_form-section-content').invoke('text')
     .then(text => {
           var fullText = text;
           cy.writeFile('cypress\\fixtures\\2fa.json', { name: 'Newuser', code: fullText })
           const token = totp(fullText);
           cy.log(token)
           cy.wrap(token).as('token')
           cy.log(token);
           cy.log('second', text)  
           cy.get('.input_field-input').clear().type(token)        
      })
     cy.get('.holla-button').click()
     cy.contains('You have successfully activated 2FA').should('exist')
     cy.get('.holla-button').click()
     cy.reload()
     
})

And ('Bob transferred a minimal amount of XHTT to Alice',()=>{
    cy.wait(3000)
    cy.contains('Wallet').click()
    cy.wait(8000)
    cy.contains('HollaEx').click()
    cy.wait(3000)
    cy.get('.with_price-block_amount-value').invoke('text')
    .then(text => {
        var fullText= text;
        cy.writeFile('cypress\\fixtures\\BobBalance.json', { name: 'XHTT', balance: fullText })
        cy.log('second', text)          
     })
    cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
    .click()
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear()
    .type('0x97b7b520e553794a610dc25d06414719ffb44a66')
    cy.get('.holla-button').click()
    cy.get('.review-crypto-amount > :nth-child(1)')
    .should('contain','0.0001 XHTT')
    cy.get('.review-wrapper > .flex-column > :nth-child(4)')
    .should('contain','0x97b7b520e553794a610dc25d06414719ffb44a66')
    cy.get('.button-success').click()
    cy.fixture('2fa')
    .then((user)=>{
          let token = totp(user.code);
          cy.log(token)
          cy.log('second', user.code)  
          cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
          .clear().type(token)        
          cy.get('.otp_form-wrapper > form.w-100 > .holla-button').click()      
       })
    cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > .icon_title-text')
    //.should('contain','Confirm Via Email')
    cy.get('.d-flex > .holla-button').click()
    cy.wait(10000)
})

And ('Bob disables 2FA',()=>{
      cy.get('.app-menu-bar-side > :nth-child(5)').click()
      cy.contains('2FA').click()
      cy.get('.checkbutton-input-wrapper').as('disable').click()
      cy.contains('Enter your authentication code to continue').should('exist')
      cy.fixture('2fa')
      .then((user)=>{
        const token = totp(user.code);
             cy.log(token)
             cy.wrap(token).as('token')
             cy.get('.input_field-input').clear().type(token)
             cy.log(token);
             cy.get('.holla-button').click()       
      })
      cy.contains('You have successfully deactivated 2FA').should('exist')
      cy.get('.holla-button').click()
      cy.reload()
  
 
}) 

When ('Bob confirm the transfer by Email',()=>{

     cy.visit(Cypress.env('EMAIL_PAGE'))
     let link; 
     var text = null      
     cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'))
     cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'))
     cy.get('#wdc_login_button').click();
     cy.get('#ext-gen52').click()
     cy.log('created new user')
     cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
     .dblclick()
     cy.wait(5000)
     cy.then(()=>{
     text =  cy.getIframe('.preview-iframe').should('not.null').toString()})
     .then((text)=>  link= cy.trimmer(text,Cypress.env('EMAIL_WITHDREAW'),Cypress.env('BOB')))
     .should('not.be.false')
     .then((link )=>cy.forceVisit(link))
     cy.wait(3000)
     cy.contains('Success').should('exist')
     cy.log("link is ", link )
     cy.writeFile('cypress\\fixtures\\timestamp.json', { name: 'timestamp', time: Date.now() })
}) 

Then ('Bob cancels the transfer',()=>{
     cy.get(':nth-child(1) > :nth-child(6) > .withdrawal-cancel')
     .click()
     cy.get('.ReactModal__Content > :nth-child(1) > .icon_title-wrapper > :nth-child(2) > .icon_title-text')
     .contains('Cancel HollaEx Withdrawal')
     cy.get('.w-100 > :nth-child(3)').click()
     cy.reload()
     cy.contains('Withdrawals').click()
     cy.get(':nth-child(1) > .transaction-status > .d-flex')
     .contains('Rejected')
     cy.contains('Signout').click()

})  
When ('Bob confirms that has not sent the minimal amount of XHTT',()=>{
     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('BOB'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(3000)
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.with_price-block_amount-value').invoke('text')
     .then(text => {
           var newBalance = text;
           cy.fixture('BobBalance')
           .then((user)=>{
                  var balance = user.balance;
                  var eq = balance-newBalance
                  expect(eq).to.equal(0);
           })  
           
           cy.contains('History').click()
           cy.contains('Withdrawals').click()
          // cy.contains('Signout').click()
          cy.get(':nth-child(1) > .coin-cell > .d-flex').contains('HollaEx')
          cy.get(':nth-child(1) > .transaction-status > .d-flex').contains('Pending')
          cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3)')
          .invoke('text')
              .then(text => {
                    var fullText = text;
                    fullText.replace('/,','/.')
                    var pattern = /[+-]?\d+(\.\d+)?/g;
                    var number = fullText.match(pattern);
                    
                    cy.wrap(number).as('Y')
                    cy.log(parseFloat(number));
                    cy.log('second', fullText)          
                  })
                  cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
                  .invoke('text')
              .then(text => {
               cy.fixture('timestamp')
               .then((user)=>{
                      var time = user.time;
                      var fullText = Date.parse(text);
                        cy.log('second', time)   
                   cy.log(text,fullText)
                   cy.log(fullText-time)
                  })
           
     })
     }) 
    // cy.contains('Signout').click()  

})  

And ('Bob confirms that has sent the minimal amount of XHTT',()=>{
     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('BOB'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(3000)
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.with_price-block_amount-value').invoke('text')
     .then(text => {
           var newBalance = text;
           cy.fixture('BobBalance')
           .then((user)=>{
                  var balance = user.balance;
                  var eq = balance-newBalance
                  expect(eq).to.within(0.00009, 0.00010009);
           })  
           
           cy.contains('History').click()
           cy.contains('Withdrawals').click()
          // cy.contains('Signout').click()
          cy.get(':nth-child(1) > .coin-cell > .d-flex').contains('HollaEx')
          cy.get(':nth-child(1) > .transaction-status > .d-flex').contains('Complete')
          cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3)')
          .invoke('text')
              .then(text => {
                    var fullText = text;
                    fullText.replace('/,','/.')
                    var pattern = /[+-]?\d+(\.\d+)?/g;
                    var number = fullText.match(pattern);
                    
                    cy.wrap(number).as('Y')
                    cy.log(parseFloat(number));
                    cy.log('second', fullText)          
                  })
                  cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
                  .invoke('text')
              .then(text => {
               cy.fixture('timestamp')
               .then((user)=>{
                      var time = user.time;
                      var fullText = Date.parse(text);
                        cy.log('second', time)   
                   cy.log(text,fullText)
                   cy.log(fullText-time)
                  })
           
     })
     }) 
     cy.contains('Signout').click()  
}) 
Then ('Alice has received the minimal amount of XHTT',()=>{
     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('ALICE'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(3000)
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('ALICE'))
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.with_price-block_amount-value').invoke('text')
     .then(text => {
           var newBalance = text;
           cy.fixture('ALiceBalance')
           .then((user)=>{
                  var balance = user.balance;
                  var eq = newBalance-balance
                  expect(eq).to.within(0.00009, 0.00010009);
           })  
           
           cy.contains('History').click()
           cy.contains('Deposits').click()
          // cy.contains('Signout').click()
          cy.get(':nth-child(1) > .coin-cell > .d-flex').contains('HollaEx')
          cy.get(':nth-child(1) > .transaction-status > .d-flex').contains('Complete')
          cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(3)')
          .invoke('text')
              .then(text => {
                    var fullText = text;
                    fullText.replace('/,','/.')
                    var pattern = /[+-]?\d+(\.\d+)?/g;
                    var number = fullText.match(pattern);
                    
                    cy.wrap(number).as('Y')
                    cy.log(parseFloat(number));
                    cy.log('second', fullText)          
                  })
                  cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
                  .invoke('text')
              .then(text => {
               cy.fixture('timestamp')
               .then((user)=>{
                      var time = user.time;
                      var fullText = Date.parse(text);
                        cy.log('second', time)   
                   cy.log(text,fullText)
                   cy.log(fullText-time)
                  })
           
     })
     cy.contains('Signout').click()
     })

And ('Bob transferred a minimal amount of XHTT to wrong Alice address',()=>{

     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(8000)
     cy.contains('HollaEx').click()
     cy.wait(3000)
     cy.get('.with_price-block_amount-value').invoke('text')
     .then(text => {
         var fullText= text;
         cy.writeFile('cypress\\fixtures\\BobBalance.json', { name: 'XHTT', balance: fullText })
         cy.log('second', text)          
      })
     cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
     .click()
     cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear()
     .type('0x97b7b520e553794a610dc25d06414719ffb44a77')
     cy.get('.holla-button').click()
     cy.get('.review-crypto-amount > :nth-child(1)')
     .should('contain','0.0001 XHTT')
     cy.get('.review-wrapper > .flex-column > :nth-child(4)')
     .should('contain','0x97b7b520e553794a610dc25d06414719ffb44a77')
     cy.get('.button-success').click()
     cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > .icon_title-text')
     //.should('contain','Confirm Via Email')
     cy.get('.d-flex > .holla-button').click()
     cy.wait(10000)

})



 
}) 
And ('Bob transferred a minimal amount of XHTT to real Alice address',()=>{

     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(8000)
     cy.contains('HollaEx').click()
     cy.wait(3000)
     cy.get('.with_price-block_amount-value').invoke('text')
     .then(text => {
         var fullText= text;
         cy.writeFile('cypress\\fixtures\\BobBalance.json', { name: 'XHTT', balance: fullText })
         cy.log('second', text)          
      })
     cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
     .click()
     cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear()
     .type(Cypress.env('ALICE_XHTT_ADDRESS'))
     cy.get('.holla-button').click()
     cy.get('.review-crypto-amount > :nth-child(1)')
     .should('contain','0.0001 XHTT')
     cy.get('.review-wrapper > .flex-column > :nth-child(4)')
     .should('contain',Cypress.env('ALICE_XHTT_ADDRESS'))
     cy.get('.button-success').click()
     cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > .icon_title-text')
     //.should('contain','Confirm Via Email')
     cy.get('.d-flex > .holla-button').click()
     cy.wait(10000)

}) 