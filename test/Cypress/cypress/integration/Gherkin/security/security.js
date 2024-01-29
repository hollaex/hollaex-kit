import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");
const randomUsername = Math.random().toString(36).substring(2,6);
var username = "tester+"+randomUsername+Cypress.env('NEW_USER')


Given ('Admin creats a user with a random username and the current password',()=>{
      
      cy.log(username);
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.contains('Operator controls').click()
      cy.contains('Users').click()
      cy.contains('Add new user').click()
      cy.get('#addUser_userEmail').clear().type(username)
      cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
      cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
      cy.get('[type="submit"]').click()
   cy.wait(3000)
    cy.contains(username)

}) 

Then ('The new username is stored',()=>{

     cy.writeFile('cypress\\fixtures\\example.json', { name: 'Newuser', email: username })
}) 

Given ('I log in as the new user name',()=>{
      
      cy.fixture('example')
      .then((user)=>{
      username = user.email
      
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(username)
      cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
})
}) 

When ('I active 2FA',()=>{

     cy.contains('Security').as('Car Keys').click({force:true})
     cy.get('.checkbutton-input-wrapper').as('enable').click({force:true})
     cy.get(':nth-child(3) > .otp_form-section-content').invoke('text')
     .then(text => {
           var fullText = text;
           cy.writeFile('cypress\\fixtures\\2fa.json', { name: 'Newuser', code: fullText })
           const token = totp(fullText);
           cy.log(token)
           cy.wrap(token).as('token')
           cy.log(token);
           cy.log('second', text)  
           cy.get('.input_field-input').clear().type(token)        
      })
     cy.get('.holla-button').click()
     cy.contains('You have successfully activated 2FA').should('exist')
     cy.get('.holla-button').click()
     
 }) 

And ('I generate API key',()=>{

//       cy.contains('API Keys')
//       cy.get('.mb-4 > .edit-wrapper__container')
//       cy.get('.input_field-input').type
//       cy.get(':nth-child(3) > .holla-button')
//       cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
//       .as('OTP')
//       cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
//       as('EmailCode')
}) 

And ('I request to change the password',()=>{
    cy.get('.tab_controller-tabs > :nth-child(2) > div').as('password section').click()
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .as('current password').clear().type(Cypress.env('PASSWORD'))
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .as('new password').clear().type(Cypress.env('NEWPASS'))
    cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .as('Confirm new password').clear().type(Cypress.env('NEWPASS'))
    cy.get('.holla-button').click()
    cy.fixture('2fa')
    .then((user)=>{
          let token = totp(user.code);
          cy.log(token)
          cy.log('second', user.code)  
          cy.get('.masterInput')
          .clear().type(token)     
          cy.contains('An email is sent to you to authorize the password change.').should('exist')   
          cy.get('.success_display-wrapper > .holla-button').click()      
       })
    
  
}) 


Then ('I logout successfully',()=>{
      cy.contains('Signout').click()
      cy.wait(5000)
}) 

When ('I confirm the transfer by Email',()=>{
      cy.visit(Cypress.env('EMAIL_PAGE'));

      // Login to the email account
      cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'));
      cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'));
      cy.get('#wdc_login_button').click();
  
      // Open the latest email in the inbox
      cy.get('#ext-gen52').click();
      cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
        .dblclick();
      cy.wait(5000);
  
      // Verify the email content
      cy.get('.preview-title').contains('sandbox Change Password Confirmation');
      cy.fixture('example')
      .then((user)=>{
           cy.get('.giraffe-emailaddress-link').last().contains(user.email);
       })
      cy.get('iframe').then(($iframe) => {
        const $emailBody = $iframe.contents().find('body');
        cy.wrap($emailBody).as('emailBody');
      });
      cy.get('@emailBody')
        .find('a')
        .should('exist');
      cy.get('@emailBody')
        .contains('You have made a request to change the password for your account.');
  
      // Get all the links with "https" protocol from the email body
      cy.get('@emailBody')
        .find('a')
        .then(($links) => {
          const httpsLinks = [];
          $links.each((index, link) => {
            const href = link.href;
            if (href && href.startsWith('https')) {
              httpsLinks.push(href);
            }
          });
          cy.wrap(httpsLinks[1]).as('httpsLink');
        });
  
      // Log the list of https links
      cy.get('@httpsLink')
        .then((httpsLink) => {
          console.log(httpsLink);
          cy.forceVisit(httpsLink);
        });
    

})
Then ('I receive a successful message',()=>{

     cy.contains('Success').should('exist')
})

Given ('I am on the Hollaex login page and enter credentials',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.fixture('example')
      .then((user)=>{cy.get('[name="email"]').clear().type(user.email)})
      cy.get('[name="password"]').clear().type(Cypress.env('NEWPASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
     
}) 

Then ('I should be able to login successfully',()=>{
      cy.fixture('2fa')
      .then((user)=>{
            const token = totp(user.code);
                 cy.log(token)
                 cy.wrap(token).as('token')
                 cy.log(token);
                 cy.log('second', user.code)
                 cy.get('.masterInput')
                 .clear().type(token)        
      })
    cy.fixture('example')
    .then((user)=>{
          cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
          .should('contain',user.email)
    })
  })
 And ('I deactivate 2FA',()=>{
          cy.reload()
          cy.contains('2FA').click()
          cy.get('.checkbutton-input-wrapper').as('disable').click()
          cy.fixture('2fa')
          .then((user)=>{
            const token = totp(user.code);
                 cy.log(token)
                 cy.wrap(token).as('token')
                 cy.get('.masterInput').clear().type(token)
                 cy.log(token);
                 cy.contains('You have successfully deactivated 2FA').should('exist')
                 cy.get('.holla-button').click() 
                  
          })
          cy.reload()
         
      
      }) 

And ('I enter incorrect credentials',()=>{
        
        cy.get('.app-menu-bar-side > :nth-child(5)').click()
        cy.get('.tab_controller-tabs > :nth-child(2) > div').as('password section').click()
        cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
        .as('current password').clear().type(Cypress.env('NEWPASS')+"wrong")
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
        .as('new password').clear().type(Cypress.env('PASSWORD'))
        cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
        .as('Confirm new password').clear().type(Cypress.env('PASSWORD'))
        cy.get('.holla-button').click()
        cy.fixture('2fa')
       .then((user)=>{
            const token = totp(user.code);
                 cy.log(token)
                 cy.wrap(token).as('token')
                 cy.log(token);
                 cy.log('second', user.code)
                 cy.get('.masterInput')
                 .clear().type(token)        
                
                  
      })
          cy.get('.warning_text').contains('Incorrect credentials.')
              

})
And ('I enter new password as same as the previous password',()=>{

      cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
      .as('current password').clear().type(Cypress.env('NEWPASS'))
      cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
      .as('new password').clear().type(Cypress.env('NEWPASS'))
      cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
      .as('Confirm new password').clear().type(Cypress.env('NEWPASS'))
      cy.get('.holla-button').click()
      cy.fixture('2fa')
     .then((user)=>{
          const token = totp(user.code);
               cy.log(token)
               cy.wrap(token).as('token')
               cy.log(token);
               cy.log('second', user.code)
               cy.get('.masterInput')
               .clear().type(token)        
               
      })
      cy.get('.warning_text').contains('New password must be different from previous password')
    
})
And ('I enter dismatched password',()=>{

      cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
      .as('current password').clear().type(Cypress.env('NEWPASS'))
      cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
      .as('new password').clear().type(Cypress.env('PASSWORD'))
      cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
      .as('Confirm new password').clear().type(Cypress.env('PASSWORD')+"wrong")
      cy.get('.field-error-text').contains("Password don't match")
      cy.get('.holla-button').should('be.disabled')
      
 
})
Then ('I request to change the password to the previous password',()=>{

    
        cy.get('.tab_controller-tabs > :nth-child(2) > div').as('password section').click()
        cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
        .as('current password').clear().type(Cypress.env('NEWPASS'))
        cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
        .as('new password').clear().type(Cypress.env('PASSWORD'))
        cy.get(':nth-child(3) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
        .as('Confirm new password').clear().type(Cypress.env('PASSWORD'))
        cy.get('.holla-button').click()
        cy.contains('An email is sent to you to authorize the password change.').should('exist')
        cy.get('.success_display-wrapper > .holla-button').click()
               
})

When ('Admin deactives the 2fa of new user',()=>{
      cy.fixture('example')
      .then((user)=>{
      username = user.email
      })
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.contains('Operator controls').click()
      cy.contains('Users').click({force: true})
      cy.get(':nth-child(2) > .ant-input').type(username)
      cy.get(':nth-child(2) > .ant-btn').click()
      cy.wait(3000)
      cy.get(':nth-child(8) > .ant-btn').click()
     
      cy.get(':nth-child(4) > .about-info-content > :nth-child(1)').contains('2FA enabled')
      cy.get(':nth-child(4) > .about-info-content > .info-link').click()
      cy.get('.mt-3').contains('Are you sure want to disable 2FA for this account?')
      cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click()
      cy.get('.my-5 > :nth-child(4) > :nth-child(1) > div').contains('2FA disabled')
      cy.contains('Logout').click()
})


Then ('The activation code is different',()=>{

      cy.get('.app-menu-bar-side > :nth-child(5)').as('Car Keys').click({force:true})
      cy.get('.checkbutton-input-wrapper').as('enable').click({force:true})
      cy.get(':nth-child(3) > .otp_form-section-content').invoke('text')
      .then(text => {
            var fullText = text;
            cy.fixture('2fa')
            .then((user)=>{
                 const token = user.code;
               expect(token).to.not.be.equal(fullText) 
            }) 
      })       
}) 