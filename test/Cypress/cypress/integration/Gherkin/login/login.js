import { commandTimings } from 'cypress-timings'
commandTimings()
import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

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
     //cy.wait(5000)
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
And  ('I receive the notification Email',()=>{
     cy.task('getLastEmail', {
          user: Cypress.env('EMAIL_ADMIN'),
          password: Cypress.env('EMAIL_PASS'),
          host: Cypress.env('EMAIL_HOST'),
          port: 993,
          tls: true  })
          .then((emailContent) => {
          cy.extractText(emailContent).then((extractedText) => {
          cy.log(`Extracted Text: ${extractedText}`);
          expect(extractedText).to.include(Cypress.env("USER0"))
          expect(extractedText).to.include('We have recorded a login') 
          });
      
      });
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

And ('I enter Expired,long,short,String and then true 2FA code',()=>{
     function shuffleString(str) {
          const arr = str.split('');
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr.join('');
        }
     cy.wait(3000)
     cy.get('.otp_form-wrapper > .icon_title-wrapper > :nth-child(2) > :nth-child(1) > .icon_title-text')
     
     .contains('Authenticator Code')
     const totp = require("totp-generator");     
     let text = Cypress.env('2FACODE')
     var fullText = text;
     const token = totp(fullText);
     console.log(token)
     cy.wrap(token).as('token')
     cy.log(token);
     cy.log('second', text)  
     cy.get('.masterInput')
     .clear().type(shuffleString(token))
     //.type('108249')        
     cy.get('.warning_text').should('contain','Invalid OTP Code')
     cy.get('.masterInput')
     .clear().type(shuffleString(token))
     //.type('108294') 
     cy.get('.warning_text').should('contain','Invalid OTP Code')  
     cy.get('.masterInput')
     .clear().type('ABCDEF') 
     cy.get('.warning_text').should('contain','Invalid OTP Code')
     cy.get('.masterInput')      
     .clear().type(token)        
 })