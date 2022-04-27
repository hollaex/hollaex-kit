import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = randomUsername+Cypress.env('NEW_USER')

Given ('I am in Hollaex signup page',()=>{

      cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
      cy.visit(Cypress.env('SIGN_UP_PAGE'))
})

When ('I fill up the form',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('.checkfield-input').should('not.be.checked')
     cy.get('[name="email"]').clear().type(username)
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('[name="password_repeat"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.checkfield-input').should('be.enabled').check();
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should("not.be.always.exist")
})

Then ('I get a success notification',()=>{

     cy.get('.icon_title-text').should('contain', 'Email sent')
     cy.wait(10000)
})
   
When ('I confirm the registration by Email',()=>{

     let text= null
     var link;
     cy.visit(Cypress.env('EMAIL_PAGE'))
     cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'))
     cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'))
     cy.get('#wdc_login_button').click();
     cy.get('#ext-gen52').click()
     cy.log('created new user')
     cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
     .dblclick()
     cy.wait(5000)
     cy.then(()=>{ text =  cy.getIframe('.preview-iframe').should('not.null').toString()})
     .then((text)=>  link= cy.trimmer(text,"https://sandbox.hollaex.com/verify",username))
     .should('not.be.false')
     .then((link )=>cy.forceVisit(link))
      cy.contains('Success').should('exist')
      cy.log("link is ", link )
 })

Then ('I am eligible to log in',()=>{})

Given ('I am in the Hollaex login page',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
 })

When ('I enter credentials',()=>{

   cy.fixture('example')
   .then((user)=>{
         cy.get('[name="email"]').clear().type(user.email)
         cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
         cy.get('.holla-button').should('be.visible').should('be.enabled').click()
         cy.get('.warning_text').should('not.exist') 
      })
}) 

Then ('I should be able to login successfully',()=>{

   cy.fixture('example')
   .then((user)=>{
        cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
        .should('contain', user.email )
        cy.writeFile('cypress\\fixtures\\example.json', {})
   })
})