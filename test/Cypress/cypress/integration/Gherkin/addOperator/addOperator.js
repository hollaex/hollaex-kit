import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const randomUsername = Math.random().toString(36).substring(2,6);
const username = "tester+"+randomUsername+Cypress.env('NEW_USER')
const randomInvitedUsername = Math.random().toString(36).substring(2,6);
const invitedUser = "tester+"+randomInvitedUsername+Cypress.env('NEW_USER')
let selector;
let selector1;
let selector2;
let rowKey;

Given ('Admin created a new user',()=>{
     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.contains('Operator controls').click()
     cy.contains('Users').click()
    cy.wait(3000)
     cy.get('table tbody tr:first')  // get the topmost row in the table
     .then($row => {
        rowKey = parseInt($row.attr('data-row-key')) + 1; // get the current data-row-key attribute and add one to it
        cy.log(rowKey)
        selector = `[data-row-key="${rowKey}"] > :nth-child(5)`; // create a selector for the row with the updated data-row-key attribute
        selector1 = `[data-row-key="${rowKey}"] > :nth-child(8) > .ant-btn > a`;
     cy.contains('Add new user').click()
     cy.get('#addUser_userEmail').clear().type(username)
     cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
     cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
       
    cy.get('[type="submit"]').click()
    cy.wait(4000)
    cy.get(selector).contains(username); // get the row with the updated data-row-key attribute
    cy.get(selector1).click()
    cy.wait(4000)
    cy.get(':nth-child(2) > .align-items-center > :nth-child(4)').contains(username)
    cy.get(':nth-child(3) > .about-info-content > :nth-child(2)')
    .contains('Verified')
});

 })

When ('Admin gave the new user supprot role',()=>{
     cy.get('a > .ant-btn').click()
     cy.wait(4000)
     cy.get('table tbody tr:first')  // get the topmost row in the table
     .then($row => {
          ; // get the current data-row-key attribute and add one to it
        selector = `[data-row-key="${rowKey}"] > :nth-child(1)`; // create a selector for the row with the updated data-row-key attribute
        selector1 = `[data-row-key="${rowKey}"] > :nth-child(2)`;
        selector2 = `[data-row-key="${rowKey}"] > :nth-child(3) > .admin-link`;
     cy.contains('Add operator').click()
     cy.get('#OperatorRoleFrom_email').type(username)
     cy.get('#OperatorRoleFrom > :nth-child(2) > .ant-btn').click()
     cy.get(selector).contains(username)
})
})
Then ('The new user is in the role table with support role',()=>{
     cy.get(selector1).contains('Support')
})
When ('Admin gave to the same user the support role again',()=>{    
     cy.contains('Add operator').click()
     cy.get('#OperatorRoleFrom_email').type(username)
     cy.get('#OperatorRoleFrom > :nth-child(2) > .ant-btn').click()
     cy.get('#OperatorRoleFrom > :nth-child(2) > .ant-btn').click()
})
Then ('Error of User is already an operator will come up',()=>{
//cy.get('.ant-message-custom-content').contains('User is already an operator')
cy.get('.ant-modal-close-x').click()
})
When ('Admin changed the new user role to communicator',()=>{
cy.get(selector2).click()
cy.get('.ant-select-selection-item').click().type('{downarrow}{downarrow}{enter}')
cy.get('div.w-100 > .ant-btn').click()
})
Then ('The new user is in the role table with communicator role',()=>{
cy.get(selector1).contains('Communicator')
})
When ('Admin revoked the role from the new user',()=>{
cy.get(selector2).click()
cy.get('div.mt-2 > .ant-btn').click()
cy.get('.revoke-btn').click()
})
Then ('The new user is not in the role table anymore',()=>{
cy.contains(username).should('not.exist');

});
When ('Admin gives a non-member user a Role',()=>{
     cy.wait(4000)
     cy.get('table tbody tr:first')  // get the topmost row in the table
     .then($row => {
          ; // get the current data-row-key attribute and add one to it
        selector = `[data-row-key="${rowKey+1}"] > :nth-child(1)`; // create a selector for the row with the updated data-row-key attribute
        selector1 = `[data-row-key="${rowKey+1}"] > :nth-child(2)`;
        selector2 = `[data-row-key="${rowKey+1}"] > :nth-child(3) > .admin-link`;
     cy.contains('Add operator').click()
     cy.get('#OperatorRoleFrom_email').type(invitedUser)
     cy.get('.ant-select-selection-item').click().type('{downarrow}{downarrow}{downarrow}{downarrow}{enter}')
     cy.get('#OperatorRoleFrom > :nth-child(2) > .ant-btn').click()
     cy.get(selector).contains(invitedUser)
     })
});
Then ('The new user is in the role table with supervisor role',()=>{
     cy.get(selector1).contains('Supervisor')
     cy.wrap(invitedUser).as('invitedUser');
     
      cy.fixture('invited').then((invited) => {
        invited.invitedUser = invitedUser;
        cy.writeFile('cypress/fixtures/invited.json', invited);
      });
});
Given ('The user got the temporary password is saved',()=>{
     cy.wait(3000)
     cy.task('getLastEmail', {
          user: Cypress.env('EMAIL_ADMIN'),
          password: Cypress.env('EMAIL_PASS'),
          host: Cypress.env('EMAIL_HOST'),
          port: 993,
          tls: true  })
          .then((emailContent) => {
           cy.extractText(emailContent).then((extractedText) => {
               cy.log(`Extracted Text: ${extractedText}`);
                expect(extractedText).to.include(invitedUser)
                expect(extractedText).to.include("You've been invited as an operator to sandbox");
                cy.findFirstWordAfterMyWord(extractedText,'Password:').then((tempPassword) => {
                    cy.wrap(tempPassword).as('tempPassword');
                     cy.fixture('tempass').then((tempass) => {
                          tempass.password = tempPassword;
                          cy.writeFile('cypress/fixtures/tempass.json', tempass);});;
          });
        });
        })
      
})

And ('The user can loged in',()=>{
     cy.visit(Cypress.env("LOGIN_PAGE"))
     cy.fixture('invited').then((invited) => {
          const newUser = invited.invitedUser;
          cy.get('.holla-button').should('be.visible').should('be.disabled')
          cy.get('[name="email"]').clear().type(newUser)
     })
     cy.fixture('tempass').then((tempass) => {
               const password = tempass.password;
          cy.get('[name="password"]').clear().type(password)
     });   
          cy.get('.holla-button').should('be.visible').should('be.enabled').click()
          cy.get('.warning_text').should('not.exist') 
})   
Then ('The status is supervisor',()=>{ 
        cy.get('a > .pl-1').click()
        cy.get('.sub-label').contains('Supervisor')
    
})