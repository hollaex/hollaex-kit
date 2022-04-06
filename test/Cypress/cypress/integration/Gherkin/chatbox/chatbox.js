import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const randomTest= Math.random().toString(36).substring(2,6);
    
Given ('I log in the Hollaex',()=>{
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
 })
 And ('I should be able to make the chatbox visible',()=>{
    
     cy.contains('Operator controls').click({force:true})
     cy.contains('Chat').click({force:true})
     cy.get('.label-inactive').invoke('text')
     .then(text => {
          cy.log('second', text)     
          if(text.includes('Off'))
             { cy.get('.ant-switch').click({force:true}).wait(2000)}     
          })
     cy.get('.label-inactive').should('contain','On')
     cy.get('.ant-switch').click({force:true})
     cy.get('.ant-message-notice-content').should('contain','Updated successfully').wait(2000)
     }) 

 And ('I should be able to enter a message',()=>{
 
     cy.contains('Chat').click({force: true})
     cy.get('.ant-input').type(randomTest)
     cy.contains('SEND').click({force: true})
     cy.contains(randomTest).should('exist')
     cy.reload()
     cy.get('.top-box-menu').click({force: true})
     cy.get('.view').should('contain',randomTest)
 })
 And ('I should be able to delete a message',()=>{

     cy.contains('Operator controls').click({force:true})
     cy.contains('Chat').click({force:true})
     cy.get(':nth-child(1) > .ant-list-item-meta > .ant-list-item-meta-content > .ant-list-item-meta-title')
     .should('contain',randomTest)
     cy.get(':nth-child(1) > .ant-list-item-action > :nth-child(1) > .ant-btn').as('Delete')
     .click({force:true})
     cy.contains(randomTest).should('not.exist')
     cy.get('.ant-input').type('techma is going to be banned')
     cy.contains('SEND').click({force: true})
     cy.get('.top-box-menu').click({force: true}).wait(5000)
     cy.get('.view').should('not.contain',randomTest)
 })
 And ('I should be able to ban a user',()=>{
     cy.contains('Operator controls').click({force:true})
     cy.contains('Chat').click({force:true})
     cy.get('.ant-list-items > :nth-child(1)').should('contain','techma')
     cy.get(':nth-child(1) > .ant-list-item-action > :nth-child(2) > .ant-btn').as('banned')
     .click({force:true})
     cy.get('@banned').should('not.be.enabled')
     cy.get('.top-box-menu').click({force: true}).wait(5000)
     cy.get('.chat-message-box').type('I am banned{enter}')
     cy.get('.view').should('not.contain','I am banned')
     cy.contains('Operator controls').click({force:true})
     cy.contains('Chat').click({force:true})
     cy.contains('I am banned').should('not.exist')
     cy.get('.ant-input').type('I am banned')
     cy.contains('SEND').click({force: true})
     cy.contains('I am banned').should('not.exist')
 })
 And ('I should be able to unban a user',()=>{
     cy.contains('Banned Users').click({force: true})
     cy.contains('USER ID: 1').should('exist')
     cy.contains('UNBAN').click({force: true})
     cy.contains('USER ID: 1').should('not.exist')
     cy.contains('Messages').click({force: true})
     cy.get('.ant-list-item-action > :nth-child(2) > .ant-btn')
     .should('be.enabled')
 })
 Then ('I should be able to make the chatbox invisible',()=>{
      cy.get('.label-inactive').should('contain','Of')
      cy.get('.ant-switch').click({force:true})
      cy.get('.ant-message-notice-content').should('contain','Updated successfully').wait(2000)
      cy.reload()
      cy.get('.top-box-menu').click({force: true}).wait(3000)
      cy.get('.view').should('not.exist')
 })