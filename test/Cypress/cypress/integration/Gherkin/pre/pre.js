import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");

Given ('I log in as an admin',()=>{
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
      .should('contain',Cypress.env('ADMIN_USER'))
      //cy.contains('Setting').click() if another language is taken does not work
      cy.get('.app-menu-bar-side > :nth-child(7)').click()
})

When ('language is English',()=>{
     //cy.contains('Language').click()
     cy.get('.tab_controller-tabs > :nth-child(3) > div').click()
     cy.get('.field-children').invoke('text')
     .then(text => {
          cy.log('second', text)     
          if(text.includes('English'))
             {cy.log('English') }  
             else{
               cy.get('.pr-4 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children')
           .as('LangInput').click()
           cy.get('#language-en-0').click()
           cy.get('.holla-button').click()
           cy.get('.d-flex > .field-label').should('contain','Language preferences (Includes Emails)')
             }   
      })    
})    

And ('Ask for confirmation before submitting orders is off',()=>{
    cy.contains('Notification').click()
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
   .invoke('text')
           .then(text => {
                 cy.log('second', text)     
                 if(text.includes('on'))
                   { cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
                  . click().wait(2000)}     
                })
})

And ('Show pop up when order has been completed if off',()=>{
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
   .invoke('text')
         .then(text => {
              cy.log('second', text)     
              if(text.includes('on'))
                 { cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
                 .click().wait(2000)}     
              })
})  

And ('Show pop up when order has partially filled is off',()=>{
    cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
    .invoke('text')
          .then(text => {
              cy.log('second', text)     
              if(text.includes('on'))
                 { cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
                . click().wait(2000)}     
              })     
      
    cy.get('.holla-button').click({force:true})  
 })

And ('All Audio cues is off',()=>{
    cy.get('.tab_controller-tabs > :nth-child(2) > div').as('Interface').click()
    cy.contains('Play Audio Cue').click()
    cy.get('.toggle-wrapper-all > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
   .invoke('text')
      .then(text => {
           cy.log('second', text)     
           if(text.includes('on'))
              { cy.get('.toggle-wrapper-all > :nth-child(1) > :nth-child(1) > .field-content > .field-children > .justify-content-between > .toggle_button-wrapper > .toggle-content > .toggle-action_button')
             . click().wait(2000) 
             cy.get('.holla-button').click()}  
           })     
   
    cy.contains('Chat').click()
    cy.get('.input_field-input')
    .invoke('text')
           .then(text => {
            cy.log('second', text)     
            if(text.includes('techma'))
               { cy.log(ok)}  
            })     
    cy.contains('Operator controls').click()
    cy.contains('Users').click({force: true})
    cy.get('.ant-input').type(Cypress.env('BOB'))
    cy.get('.ant-btn').click().wait(4000)
})

And ('Bob 2fa is desabled',()=>{
     cy.get('body').then(($body) => {
     if ($body.text().includes('2FA disabled')) {
     cy.get('.my-5 > :nth-child(3) > :nth-child(1) > div').contains('2FA disabled')
     cy.log('ok')
         } else {
     cy.get(':nth-child(3) > .about-info-content > :nth-child(1)').contains('2FA enabled')
     cy.get(':nth-child(3) > .about-info-content > .info-link').click()
     cy.get('.mt-3').contains('Are you sure want to disable 2FA for this account?')
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click()
     cy.get('.my-5 > :nth-child(3) > :nth-child(1) > div').contains('2FA disabled')
                 }
}) 

And ('chatbox is off',()=>{
    cy.contains('Chat').click({force:true})
    cy.get('.label-inactive').invoke('text')
    .then(text => {
          cy.log('second', text)     
          if(text.includes('On'))
             { cy.get('.ant-switch').click({force:true}).wait(2000)}})
     cy.get('.label-inactive').should('contain','Off')
     cy.get('.ant-switch').click({force:true})
     cy.get('.ant-message-notice-content').should('contain','Updated successfully').wait(2000)
          })
})

And ('XHTT spread in market is less than 0.001',()=>{
    cy.get('.top-box-menu').click()
    cy.contains('Pro trade').click()
    cy.contains('XHTT/USDT').click()
    cy.get('.app_bar-currency-txt').should('have.text', 'XHTT/USDT:')
    cy.get('.trade_orderbook-asks > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
    .should('be.visible')
    cy.log('check lowest aks exist and click on the price will send the price')
    cy.get('.trade_orderbook-asks > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
    .as('lowestSell').should('be.visible')
     cy.get('@lowestSell').should('be.visible')
     cy.get('.trade_orderbook-asks')
    cy.get('.trade_orderbook-bids > :nth-child(1) > .d-flex > .trade_orderbook-cell-price')
    .should('be.visible').as('highestBuy')
    cy.get('.trade_orderbook-spread-text')
    .invoke('text')
    .then(text => {
         cy.log('second', text)     
         if(parseFloat(text) > 0.001)
            { cy.log('Ok')}     
         })
})
 


    
 


       
      
 
      
 


