import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = randomUsername+Cypress.env('NEW_USER')

//Background: 
Given ('user on the homepage',()=>{
 
      cy.wrap(username).as('username')
      cy.log(username);
      cy.visit(Cypress.env('WEBSITE'))
})  

And ("user should click {string}",(Signup)=>{

    cy.get('[href="/signup"] > .holla-button').click()
    cy.url().should('include', 'signup')
})    

//Scenario: Create a New User with aid of Admin
When ("user fills registration email textbox with {string},{string},and user clicks {string}",
(randomaUsername,ATtestsaeDotcom,signup)=>{
    
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
And ('{string} can not login',(randomaUsername)=>{

    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(username)
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('contain','User email is not verified') 
})

When ('{string} confirms  {string}',(admin, randomaUsername)=>{

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
     cy.get('.ant-btn').click().wait(4000)
     cy.get(':nth-child(2) > :nth-child(1) > .info-link').click()
     cy.get('.mb-4 > :nth-child(2)').should('contain','Are you sure you want to mark this email as verified?')
     cy.get(':nth-child(1) > :nth-child(3) > .ant-btn').click()
     cy.contains('Logout').click()
})  
Then ('{string} can login',(randomaUsername)=>{
    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(username)
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
    cy.contains('Signout').click()
})
//Scenario: Rejection of wrong username and password
When ("user fills registration email textbox with {string} and {string}",
     (existed,ATtestsaeDotcom)=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('.checkfield-input').should('not.be.checked')
     cy.get('[name="email"]').clear().type(username)
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('[name="password_repeat"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.checkfield-input').should('be.enabled').check();
     cy.get('.holla-button').click()
     cy.get('.warning_text').should('contain','User already exists')
})   
    
And ('user enters the {string}',(weakPassword)=>{

    cy.get('.holla-button').should('be.visible').should('be.disabled')
   // cy.get('.checkfield-input').should('not.be.checked')
    cy.get('[name="email"]').clear().type(username)
    cy.get('[name="password"]').clear().type('weakpassword')
    cy.get('.field-error-text')
    .contains('Invalid password. It has to contain at least 8 characters, at least one digit and one character.')
    cy.get('[name="password_repeat"]').clear().type('weakpassword')
    cy.get('.checkfield-input').should('be.enabled').check();
    cy.get('.holla-button').should('not.be.enabled')
   // cy.get('.warning_text').should('contain','User already exists')
})  

And ('user enters the {string} as well',(diffrentPassword)=>{

    cy.get('.holla-button').should('be.visible').should('be.disabled')
    //cy.get('.checkfield-input').should('not.be.checked')
    cy.get('[name="email"]').clear().type(username)
    cy.get('[name="password"]').clear().type('diffrentPassword!1')
    cy.get('[name="password_repeat"]').clear().type('diffrentPassword!2')
    cy.get(':nth-child(3) > .field-error-content')
    .contains("Password don't match")
    cy.get('.checkfield-input').should('be.enabled').check();
    cy.get('.holla-button').should('not.be.enabled')
    //cy.get('.warning_text').should('contain','User already exists')
    
})  

And ('user arbitrary enter {string}',(WrongReferralcode)=>{})  

