import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const number = `${Math.floor(Math.random() * 100)}`

Given ("Admin logged in",()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
      .should('contain',Cypress.env('ADMIN_USER'))      
}) 
  
When ("Discount rate is in the range of {string} to {string} for {string}",(zero,hundred,userlevelATtestsaeDOTcom)=>{
 
     cy.visit('https://sandbox.hollaex.com/admin/user')
     cy.wait(3000)
     cy.get('.ant-input').type(Cypress.env('LEVEL_NAME'))
     cy.get('.ant-btn').click()
     cy.contains('Adjust').click()
     cy.get('#user-discount-form_feeDiscount').clear().type('101')
     cy.get('.ant-form-item-explain > div').should('be.exist') 
     cy.get('#user-discount-form_feeDiscount').clear().type('-1')
     cy.get('.ant-form-item-explain > div').should('be.exist') 
}) 
 
 And ("Admin adjust the discount rate for a user {string}",(userlevelATtestsaeDOTcom)=>{
    
     cy.get('#user-discount-form_feeDiscount').clear().type(number)
     cy.contains('Next').click()
     cy.get('.mt-2').should('contain',number)
     cy.get('.button-wrapper > :nth-child(2)').click()
     cy.get('.ant-message-notice-content').should('contain','successfully')
     cy.get(':nth-child(2) > .sidebar-menu').click()
 }) 

Then ("The user profile page of {string} should present the discount rate",(userlevelATtestsaeDOTcom)=>{
     
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('LEVEL_NAME'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('LEVEL_NAME').toLowerCase())
     cy.get('.trade-account-secondary-txt > .d-flex > :nth-child(2)')
     .should('contain',number)
}) 
