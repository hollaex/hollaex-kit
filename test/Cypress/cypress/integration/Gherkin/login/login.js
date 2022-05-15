import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('I enter credentials Username,Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env("USER0"))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should be able to login successfully',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
})

When ('I enter credentials Wrong Username,Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type('Iamnot@Iamnot.com')
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should not be able to login successfully and get error',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('exist') 
})

When ('I enter credentials Username,wrong Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('USER0'))
     cy.get('[name="password"]').clear().type('WrongPass123')
})

Then ('I should not be able to login successfully and get error',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('exist') 
})

When ('I enter credentials Frozen Username,Password',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('FROZEN'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

Then ('I should not be able to login successfully and get This account is frozen',()=>{

     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('contain','This account is frozen')
})

When ('I enter credentials 2FA enabled Username,Password',()=>{
     
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('2FA'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
})

And ('I enter Expired,long,short and then true 2FA code',()=>{
     cy.wait(3000)
     cy.get('.otp_form-wrapper > .icon_title-wrapper > :nth-child(2) > .icon_title-text')
     .contains('Authenticator Code')
     const totp = require("totp-generator");     
     let text = Cypress.env('2FACODE')
     var fullText = text;
     const token = totp(fullText);
     console.log(token)
     cy.wrap(token).as('token')
     cy.log(token);
     cy.log('second', text)  
     cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear().type('543065')        
      cy.get('.otp_form-wrapper > form.w-100 > .holla-button').should('not.be.disabled').click()
     cy.get('.warning_text').should('contain','Invalid OTP Code')
     cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear().type('5430656')        
     cy.get('.otp_form-wrapper > form.w-100 > .holla-button').should('be.disabled')
     cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
     .clear().type(token)        
     cy.get('.otp_form-wrapper > form.w-100 > .holla-button').click()
})