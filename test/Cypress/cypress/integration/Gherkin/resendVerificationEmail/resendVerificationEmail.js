import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = "tester+"+randomUsername+Cypress.env('NEW_USER')

Given ('I am on the Hollaex signup page',()=>{

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
      cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
      cy.wait(5000)
})

When ('I ask for a resending verification email, I should be redirected to the related page',()=>{

    // cy.get('.blue-link')
     cy.get('.signup_success-wrapper > :nth-child(3) > .blue-link')
     .should('contain','Request another one here')
    .click()
    cy.url().should('include', 'verify')
})

And ('I should be able to enter my email successfully',()=>{
    cy.get('.holla-button').should('not.be.enabled')
    cy.get('.input_field-input').clear().type('tester+iamnot@hollaex.email')
    cy.get('.holla-button').click({force:true});
    cy.get('.warning_text').contains('A verification code has been sent to your email with the code')

    cy.get('.holla-button').should('not.be.enabled')
    cy.get('.input_field-input').clear().type('tester+5xo7@hollaex.email')
    cy.get('.holla-button').click({force:true});
    cy.get('.warning_text').contains('A verification code has been sent to your email with the code if your email is in the system')
    
    cy.get('.holla-button').should('not.be.enabled')
    cy.get('.input_field-input').clear().type(username)
    cy.get('.holla-button').click({force:true});
    cy.contains('Resent Email').should('exist')
})

Then ('I should be redirected contact us page',()=>{

    cy.get('.holla-button').as('contact us').should('be.enabled').click({force:true})
    cy.get(':nth-child(3) > .holla-button')
    .should('be.enabled')
})

When ('I confirm the registration by Email',()=>{

   
    cy.task('getLastEmail', {
    user: Cypress.env('EMAIL_ADMIN'),
    password: Cypress.env('EMAIL_PASS'),
    host: Cypress.env('EMAIL_HOST'),
    port: 993,
    tls: true  })
    .then((emailContent) => {
     cy.extractText(emailContent).then((extractedText) => {
     cy.log(`Extracted Text: ${extractedText}`);
     cy.fixture('example')
      .then((user)=>{
       expect(extractedText).to.include(user.email)
    })
  
      cy.findFirstHyperlinkAfterMyWord(extractedText,'[').then((link) => {
      cy.forceVisit(link);
      cy.contains('Confirm Sign Up').should('exist')
      cy.contains('CONFIRM SIGN UP').click()
      cy.contains('Success').should('exist')
    });
  });
  })
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

Then ('I should be able to login successfully and Verification email should be the same',()=>{

  cy.fixture('example')
  .then((user)=>{
       cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
       .should('contain', user.email )
       cy.contains('Verification').click()
       cy.contains('Email').click()
       cy.get('.information-content').should('contain', user.email )
       cy.writeFile('cypress\\fixtures\\example.json', {})
  })
})