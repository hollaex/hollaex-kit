
import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");
const randomUsername = Math.random().toString(36).substring(2,6);
var username = "tester+"+randomUsername+Cypress.env('NEW_USER')


Given ('Admin creats a user with a random username and the current password',()=>{
      
      cy.log(username);
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.contains('Operator controls').click()
      cy.contains('Users').click()
      cy.contains('Add new user').click()
      cy.get('#addUser_userEmail').clear().type(username)
      cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
      cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
      cy.get('[type="submit"]').click()
   cy.wait(3000)
    cy.contains(username)

}) 

Then ('The new username is stored',()=>{

     cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
}) 

Given ("I  logged in succesfully",()=>{
    
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(username)
      cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
      .should('contain',username.toLowerCase())
      cy.visit(Cypress.env('WEBSITE')+"wallet/usdt")
      cy.get('[href="/wallet/usdt/deposit"] > .holla-button').click()
      cy.get('.dropdown-placeholder').click()
      cy.get(' #network-trx-1').click()
})

When ("I dont have wallets",()=>{

     cy.get('.holla-button').should('contain','Generate Wallet')
}) 

And ("I genrate TRC20 wallet",()=>{

    cy.get('.holla-button').click({force:true})
    cy.get('.font-weight-bold > .edit-wrapper__container')
    .should('contain','Generate USD Tether Wallet')
    cy.get('.mt-4 > :nth-child(3)').click({force:true})
})

Then ("I should have TRC20 wallet",()=>{
    
    cy.contains('Your USD Tether receiving address').should('exist')
    cy.get('#network-trx-undefined').should('exist')
})

And ("I genrate ERC20 wallet",()=>{

    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children')
    .click()
    cy.get('#network-eth-0').click({force:true})
    cy.get('.holla-button').click({force:true})
    cy.get('.font-weight-bold > .edit-wrapper__container').should('contain','Generate USD Tether Wallet')
    cy.get('.mt-4 > :nth-child(3)').click({force:true})
})

Then ("I should have ERC20 wallet",()=>{

     cy.contains('Your USD Tether receiving address').should('exist')
     cy.get('#network-eth-undefined').should('exist')
  })

And ("I genrate BEP20 wallet",()=>{

    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children')
    .click()
    cy.get('#network-bnb-2').click({force:true})
    cy.get('.holla-button').click({force:true})
    cy.get('.font-weight-bold > .edit-wrapper__container').should('contain','Generate USD Tether Wallet')
    cy.get('.mt-4 > :nth-child(3)').click({force:true})
})

Then ("I should have BEP20 wallet",()=>{

     cy.contains('Your USD Tether receiving address').should('exist')
     cy.get('#network-bnb-undefined').should('exist')
    
})