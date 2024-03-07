import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = 'tester+'+randomUsername+Cypress.env('NEW_USER')
Given ('I am logged in as an admin',()=>{
    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
    cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
    })
And ('I disallow new sign-ups',()=>{
    cy.get('a > .pl-1').click()
    cy.contains('General').click()
    cy.contains('Onboarding').click()
    cy.get('.label-inactive').contains('Off')
    cy.get('.ant-switch').click()
    cy.contains('Turn off sign ups')
    cy.get(':nth-child(3) > .ant-btn').click()
    cy.get('.ant-message-notice-content').should('contain','Updated successfully')
    cy.get('.label-inactive').contains('On')
    cy.get(':nth-child(2) > .sidebar-menu').click()

})


When ('I am in Hollaex signup page',()=>{

      cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
      cy.visit(Cypress.env('SIGN_UP_PAGE'))
})

And ('I fill up the form',()=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('.checkfield-input').should('not.be.checked')
     cy.get('[name="email"]').clear().type(username)
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('[name="password_repeat"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.checkfield-input').should('be.enabled').check();
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     
})

Then ('I get a unsuccess notification',()=>{

    cy.get('.warning_text').contains('Sign up not available')
})

And ('I allow new sign-ups',()=>{
    cy.get('a > .pl-1').click()
    cy.contains('General').click()
    cy.contains('Onboarding').click()
    cy.get('.label-inactive').contains('On')
    cy.get('.ant-switch').click()
    
    cy.get('.ant-message-notice-content').should('contain','Updated successfully')
    cy.get('.label-inactive').contains('Off')
    

})
And ('I disable Enable email verification requirement',()=>{
    cy.get('#email-verification-form_email_verification_required').uncheck()
    cy.get('#email-verification-form > :nth-child(2) > div > .ant-btn').click()
    cy.get('.ant-message-notice-content').should('contain','Updated successfully')
    cy.get(':nth-child(2) > .sidebar-menu').click()
})

When ('A non verified user tries to login',()=>{
    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type('tester+off@hollaex.email')
    cy.get('[name="password"]').clear().type('Holla2021!')
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    //cy.get('.warning_text').should('not.exist') 
}) 
Then ('He can log in',()=>{
    cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
    .contains('tester+off@hollaex.email')
})

Then ('He can not log in',()=>{
    cy.get('.warning_text').contains('User email is not verified') 
})  

And ('I Enable email verification requirement',()=>{
    cy.get('a > .pl-1').click()
    cy.contains('General').click()
    cy.contains('Onboarding').click()
    cy.get('#email-verification-form_email_verification_required').check()
    cy.get('#email-verification-form > :nth-child(2) > div > .ant-btn').click()
    cy.get('.ant-message-notice-content').should('contain','Updated successfully')
    cy.get(':nth-child(2) > .sidebar-menu').click()
})
