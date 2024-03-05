import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");

Given ('Alice logged in successfully',()=>{
     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type('tester+alice@hollaex.email')
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(5000)
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .should('contain','tester+alice@hollaex.email')
}) 

And ('Alice has X amount of XHTT',()=>{
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
     .then(text => {
          const regex = /\d+\.?\d*/g;
           var fullText = text.match(regex);
           cy.writeFile('cypress\\fixtures\\AliceBalance.json', { name: 'XHTT', balance: fullText })
           cy.log('second', fullText)          
     })
     cy.contains('Signout').click()
}) 

When ('Bob logged in successfully',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type('bob@hollaex.email')
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(5000)
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
})

And ('Bob enables 2FA',()=>{

     cy.get('.app-menu-bar-side > :nth-child(6)').as('Car Keys').click()
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
    cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
    .then(text => {
        const regex = /\d+\.?\d*/g;
        var fullText= text.match(regex);
        cy.writeFile('cypress\\fixtures\\BobBalance.json', { name: 'XHTT', balance: fullText })
        cy.log('second', fullText)          
     })
    cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
    .click()
    cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear()
    .type('0xc99fc19ebdcc683d15d116360525c09417c109df')
    cy.get(':nth-child(4) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > [style="display: flex;"] > .input_field-input')
    .clear()
    .type('0.0001')
    cy.get('.holla-button').click()
    cy.get('.review-crypto-amount > :nth-child(1)')
    .should('contain','10.0001 XHT')//changed
    cy.get('.review-wrapper > .flex-column > :nth-child(4)')
    .should('contain','0xc99fc19ebdcc683d15d116360525c09417c109df')
    cy.get('.button-success').click()
    cy.fixture('2fa')
    .then((user)=>{
          let token = totp(user.code);
          cy.log(token)
          cy.log('second', user.code)  
          //cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
          cy.get('.masterInput')
          .clear().type(token)        
               
       })
  cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > :nth-child(1)')
   .should('contain','Confirm via Email')
  
    cy.get('.d-flex > .holla-button').click()
    cy.wait(10000)
})

And ('Bob disables 2FA',()=>{
      cy.get('.app-menu-bar-side > :nth-child(6)').click()
      cy.contains('2FA').click()
      cy.get('.checkbutton-input-wrapper').as('disable').click()
      cy.get('.ReactModal__Content')
      cy.contains('Enter your 6-digit code to continue').should('exist')
      cy.fixture('2fa')
      .then((user)=>{
        const token = totp(user.code);
             cy.log(token)
             cy.wrap(token).as('token')
             cy.get('.masterInput').clear().type(token)
             cy.log(token);
             cy.get('.holla-button').click()       
      })
     
      cy.reload()
  
 
}) 

When ('Bob confirm the transfer by Email',()=>{

     cy.visit(Cypress.env('EMAIL_PAGE'));

    // Login to the email account
    cy.get('#wdc_username_div').type(Cypress.env('EMAIL_BOB'));
    cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'));
    cy.get('#wdc_login_button').click();

    // Open the latest email in the inbox
    cy.get('#ext-gen52').click();
    cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
      .dblclick();
    cy.wait(5000);

    // Verify the email content
    cy.get('.preview-title').contains('sandbox XHT Withdrawal Request');
    cy.fixture('example')
    cy.get('.giraffe-emailaddress-link').last().contains('bob')
    
    cy.get('iframe').then(($iframe) => {
      const $emailBody = $iframe.contents().find('body');
      cy.wrap($emailBody).as('emailBody');
    });
    cy.get('@emailBody')
      .find('a')
      .should('exist');
    cy.get('@emailBody')
      .contains('You have made a XHT withdrawal request');

    // Get all the links with "https" protocol from the email body
    cy.get('@emailBody')
      .find('a')
      .then(($links) => {
        const httpsLinks = [];
        $links.each((index, link) => {
          const href = link.href;
          if (href && href.startsWith('https')) {
            httpsLinks.push(href);
          }
        });
        cy.wrap(httpsLinks[1]).as('httpsLink');
      });

    // Log the list of https links
    cy.get('@httpsLink')
      .then((httpsLink) => {
        console.log(httpsLink);
       cy.forceVisit(httpsLink);
      });

      cy.contains('Final Withdrawal Confirmation').should('exist')
      cy.contains('CONFIRM WITHDRAWAL').click()
      cy.contains('Success').should('exist')
     cy.writeFile('cypress\\fixtures\\timestamp.json', { name: 'timestamp', time: Date.now() })
}) 

Then ('Bob cancels the transfer',()=>{
     cy.contains('Cancel').click()
     cy.contains('Cancel')
     cy.get('.w-100 > :nth-child(3) > .edit-wrapper__container > :nth-child(1)')
     .click()
     cy.wait(3000)
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
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
     .then(text => {
          const regex = /\d+\.?\d*/g;
           var newBalance = text.match(regex);
           cy.fixture('BobBalance')
           .then((user)=>{
                  var balance = user.balance;
                  var eq = balance-newBalance
                  //expect(eq).to.equal(0);
                  const expectedValue = 1;
                  const actualValue = eq/* Get the actual value from your application */;
                  const tolerance = 0.0001; // Define an acceptable tolerance
                
                  cy.wrap(actualValue).should('be.closeTo', expectedValue, tolerance);
           })  
           
           cy.contains('History').click()
           cy.contains('Withdrawals').click()
           cy.wait(5000)
          // cy.contains('Signout').click()
          cy.get(':nth-child(1) > .coin-cell > .d-flex').contains('HollaEx')
          cy.get(':nth-child(1) > .transaction-status > .d-flex').contains('Pending')
          cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(5)')
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
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
     .then(text => {
          const regex = /\d+\.?\d*/g;
           var newBalance = text.match(regex);
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
     cy.get('[name="email"]').clear().type('tester+alice@hollaex.email')
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.wait(3000)
     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
     .should('contain','tester+alice@hollaex.email')
     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(3000)
     cy.contains('HollaEx').click()
     cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
     .then(text => {
          const regex = /\d+\.?\d*/g;
           var newBalance = text.match(regex);
           cy.log(newBalance)
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
 
}) 
And ('Bob transferred a minimal amount of XHTT to wrong Alice address',()=>{

     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(8000)
     cy.contains('HollaEx').click()
     cy.wait(3000)
     cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
     .then(text => {
          const regex = /\d+\.?\d*/g;
         var fullText= text.match(regex);
         cy.writeFile('cypress\\fixtures\\BobBalance.json', { name: 'XHTT', balance: fullText })
         cy.log('second', text)          
      })
     cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
     .click()
     cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear().type('0xc99fc19ebdcc683d15d116360525c09417c109dh')
   
     cy.contains('Invalid ETH address')
     cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear()
     cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear()
     .type('0x97b7b520e553794a610dc25d06414719ffb44a77')
     cy.get(':nth-child(4) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > [style="display: flex;"] > .input_field-input')
     .clear()
     .type('0.0001')
     cy.get('.holla-button').click()
     cy.get('.review-crypto-amount > :nth-child(1)')
     .should('contain','10.0001 XHT')//changed
     cy.get('.review-wrapper > .flex-column > :nth-child(4)')
     .should('contain','0x97b7b520e553794a610dc25d06414719ffb44a77')
     cy.get('.button-success').click()
     cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > :nth-child(1)')
     .should('contain','Confirm via Email')
    
      cy.get('.d-flex > .holla-button').click()
      cy.wait(10000)

})

And ('Bob transferred a minimal amount of XHTT to real Alice address',()=>{

     cy.wait(3000)
     cy.contains('Wallet').click()
     cy.wait(8000)
     cy.contains('HollaEx').click()
     cy.wait(3000)
     cy.get('.available-balance-wrapper > :nth-child(1) > :nth-child(1)').invoke('text')
     .then(text => {
          const regex = /\d+\.?\d*/g;
         var fullText= text.match(regex);
         cy.writeFile('cypress\\fixtures\\BobBalance.json', { name: 'XHTT', balance: fullText })
         cy.log('second', text)          
      })
     cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
     .click()
     cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear()
     .type('0x97b7b520e553794a610dc25d06414719ffb44a77')
     cy.get(':nth-child(4) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > [style="display: flex;"] > .input_field-input')
     .clear()
     .type('0.0001')
     cy.get('.holla-button').click()
     cy.get('.review-crypto-amount > :nth-child(1)')
     .should('contain','10.0001 XHT')//changed
     cy.get('.review-wrapper > .flex-column > :nth-child(4)')
     .should('contain','0x97b7b520e553794a610dc25d06414719ffb44a77')
     cy.get('.button-success').click()
     cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > :nth-child(1)')
     .should('contain','Confirm via Email')
    
      cy.get('.d-flex > .holla-button').click()
      cy.wait(10000)

}) 
