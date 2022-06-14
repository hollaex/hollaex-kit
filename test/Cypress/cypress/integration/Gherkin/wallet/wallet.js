
import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = randomUsername+Cypress.env('NEW_USER')

Given ('I sign up with a random username and the current password',()=>{

    cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
    cy.log(username);
    cy.visit(Cypress.env('SIGN_UP_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('.checkfield-input').should('not.be.checked')
    cy.get('[name="email"]').clear().type(username)
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
    cy.get('[name="password_repeat"]').clear().type(Cypress.env('PASSWORD'))
    cy.get('.checkfield-input').should('be.enabled').check();
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should("not.be.always.exist")
    cy.get('.icon_title-text').should('contain', 'Email sent')
 
 })

When ('Admin confirms the new user',()=>{

     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('ADMIN_USER'))
     cy.contains('Operator controls').click()
     cy.contains('Users').click({force: true})
     cy.get('.ant-input').type(username)
     cy.get('.ant-btn').click()
     cy.get(':nth-child(2) > :nth-child(1) > .info-link').click()
     cy.get('.mb-4 > :nth-child(2)').should('contain','Are you sure you want to mark this email as verified?')
     cy.get(':nth-child(1) > :nth-child(3) > .ant-btn').click()
})

Then ('I registered with the new username',()=>{}) 

Given ("I  logged in succesfully",()=>{
    
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(username)
      cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
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