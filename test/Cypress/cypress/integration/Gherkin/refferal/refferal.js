import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = "tester+"+randomUsername + Cypress.env('NEW_USER')

Given ("I Log in to get the referral code as the referee",()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
      .should('contain',Cypress.env('ADMIN_USER'))
      cy.get(':nth-child(4) > .trade-account-link > .pointer').click()
}) 

And ("Get Referral link {string}",(referralCode)=>{

    cy.get('.address-line').invoke('text')
    .then(text => {
          var referralCode = text;
          cy.wrap(referralCode).as('referralLink')
          cy.log('second', text)          
    })
}) 

And ("I have referred X users as the current user",()=>{

    cy.get('.user_refer_info > :nth-child(1) > .edit-wrapper__container > :nth-child(1)').click({force:true})
    cy.get('.user_refer_info > :nth-child(1) > .edit-wrapper__container > :nth-child(1)').invoke('text')
    .then(text => {
          var fullText = text;
          var pattern = /[0-9]+/g;
          var number = fullText.match(pattern);
          cy.wrap(Number(number)+1).as('X')
          cy.log(number);
          cy.log('second', text)          
     })
}) 

Then  ("a new {string} user sign up with {string}",(random,ReferralCode)=>{


      cy.get('.mr-5').click()
      cy.contains('Signout').click()
      cy.get("@referralLink").then(val => cy.visit(val))
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

Then  ("I log in as the referee",()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
      .should('contain',Cypress.env('ADMIN_USER'))
      cy.get(':nth-child(4) > .trade-account-link > .pointer').click()
})  

And  ("I have referred Y users as New user",()=>{

     cy.get('.user_refer_info > :nth-child(1) > .edit-wrapper__container > :nth-child(1)').click({force:true})
     cy.get('.user_refer_info > :nth-child(1) > .edit-wrapper__container > :nth-child(1)').invoke('text')
     .then(text => {
           var fullText = text;
           var pattern = /[0-9]+/g;
           var number = fullText.match(pattern);
           cy.wrap(number).as('Y')
           cy.log(number);
           cy.log('second', text)          
         })
}) 

When  ("Y - X = 1",()=>{

  cy.get('@X')
  .then(val => {
        const Y = val
        cy.get('@Y')
        .then(val1 => expect(Number(val1)).to.equal(Y))
       

      
  })
  And  ("the new {string} user should be in All Successful Referrals list",(random)=>{
   //cy.contains('view').click()
   cy.get('.underline-text > .edit-wrapper__container > :nth-child(1)').click()
   //cy.get(':nth-child(3) > .action_notification-wrapper > .action_notification-text')
   cy.get('.table_body-wrapper > :nth-child(1) > :nth-child(1) > .d-flex')
   .contains(username)
   
  })
  And  ("the new {string} user should be in User profile Referral",(random)=>{
      cy.get('.my-5 > :nth-child(2)').click()
   cy.get('a > .pl-1').click()
   cy.get(':nth-child(4) > .no-link').click()
   cy.get(':nth-child(1) > .ant-input').type('1')
   cy.get(':nth-child(2) > .ant-btn').click()
   cy.wait(5000)
   cy.get(':nth-child(8) > .ant-btn').click()
   //cy.get('.ant-btn').click()
   cy.get('#rc-tabs-0-tab-referrals').click()
   cy.get('.ant-table-tbody > :nth-child(1) > :nth-child(2) > :nth-child(1) > .px-2')
   .contains(username)
  })
 })
            