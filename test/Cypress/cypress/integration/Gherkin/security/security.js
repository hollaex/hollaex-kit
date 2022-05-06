import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
const totp = require("totp-generator");
const randomUsername = Math.random().toString(36).substring(2,6);
var username = randomUsername+Cypress.env('NEW_USER')


Given ('I sign up with a random username and the current password',()=>{
      
      cy.log(username);
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
}) 

When ('Admin confirms the new user',()=>{

     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
//      cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
//      .should('contain',Cypress.env('ADMIN_USER'))
     cy.contains('Operator controls').click()
     cy.contains('Users').click({force: true})
     cy.get('.ant-input').type(username)
     cy.get('.ant-btn').click()
     cy.get(':nth-child(2) > :nth-child(1) > .info-link').click()
     cy.get('.mb-4 > :nth-child(2)')
     .should('contain','Are you sure you want to mark this email as verified?')
     cy.get(':nth-child(1) > :nth-child(3) > .ant-btn').click()
}) 

Then ('I registered with the new username',()=>{

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

     cy.get('.app-menu-bar-side > :nth-child(5)').as('Car Keys').click({force:true})
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
     //this is a minor bug should be considered reload should be part of activation 
    cy.reload()
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
          cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
          .clear().type(token)        
          cy.get('.otp_form-wrapper > form.w-100 > .holla-button').click()      
       })
    //cy.contains('An email is sent to you to authorize the password change.').should('exist')
    cy.get('.success_display-wrapper > .holla-button').click()
}) 


Then ('I logout successfully',()=>{
      cy.contains('Signout').click()
      cy.wait(5000)
}) 

When ('I confirm the transfer by Email',()=>{
      cy.fixture('example')
      .then((user)=>{
      username = user.email
      })
    let link; 
    var text = null  
    cy.visit(Cypress.env('EMAIL_PAGE'))
    cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'))
    cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'))
    cy.get('#wdc_login_button').click();
    cy.get('#ext-gen52').click()
    cy.log('created new user')
     cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
    .dblclick()
    cy.wait(5000)
    cy.then(()=>{
            text =  cy.getIframe('.preview-iframe').should('not.null').toString()
      })
      .then((text)=>  link= cy.trimmer(text,Cypress.env('EMAIL_CONFIRM'),username))
      .should('not.be.false').log("link is :"+link)
      
      .then((link )=>cy.forceVisit(link))
      cy.wait(3000)

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
                 cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
                 .clear().type(token)        
                 cy.get('.otp_form-wrapper > form.w-100 > .holla-button').click()
                // cy.writeFile('cypress\\fixtures\\2fa.json', {})  
      })
    cy.fixture('example')
    .then((user)=>{
          cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
          .should('contain',user.email)
       //   cy.writeFile('cypress\\fixtures\\example.json', {})
    })

 And ('I deactivate 2FA',()=>{
          //cy.get('.app-menu-bar-side > :nth-child(5)').click()
          cy.contains('2FA').click({force:true})
          cy.get('.checkbutton-input-wrapper').as('disable').click({force:true})
          cy.contains('Enter your authentication code to continue').should('exist')
          cy.fixture('2fa')
          .then((user)=>{
            const token = totp(user.code);
                 cy.log(token)
                 cy.wrap(token).as('token')
                 cy.get('.input_field-input').clear().type(token)
                 cy.log(token);
                 cy.get('.holla-button').click()       
          })
          cy.contains('You have successfully deactivated 2FA').should('exist')
          cy.get('.holla-button').click()
          cy.reload()
      
      }) 

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
                 cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
                 .clear().type(token)        
                 cy.get('.otp_form-wrapper > form.w-100 > .holla-button').click()
                  
      })
        //cy.contains('An email is sent to you to authorize the password change.').should('exist')
        //cy.get('.success_display-wrapper > .holla-button').should('be.disabled')
        cy.get('.warning_text').contains('Credentials incorrect')
        cy.get('.action_notification-image').click()
       

})
And ('I enter new password as same as the previous password',()=>{

     // cy.get('.app-menu-bar-side > :nth-child(5)').click()
      //cy.get('.tab_controller-tabs > :nth-child(2) > div').as('password section').click()
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
               cy.get('.otp_form-wrapper > form.w-100 > .w-100 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
               .clear().type(token)        
               cy.get('.otp_form-wrapper > form.w-100 > .holla-button').click()
      })
      //cy.get('.success_display-wrapper > .holla-button').should('be.disabled')
      cy.get('.warning_text').contains('New password must be different from previous password')
      cy.get('.action_notification-image').click()
})
And ('I enter dismatched password',()=>{

      //cy.get('.app-menu-bar-side > :nth-child(5)').click()
      //cy.get('.tab_controller-tabs > :nth-child(2) > div').as('password section').click()
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

     // cy.get('.app-menu-bar-side > :nth-child(5)').click()
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
 //      cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
 //      .should('contain',Cypress.env('ADMIN_USER'))
      cy.contains('Operator controls').click()
      cy.contains('Users').click({force: true})
      cy.get('.ant-input').type(username)
      cy.get('.ant-btn').click()
     
      cy.get(':nth-child(3) > .about-info-content > :nth-child(1)').contains('2FA enabled')
      cy.get(':nth-child(3) > .about-info-content > .info-link').click()
      cy.get('.mt-3').contains('Are you sure want to disable 2FA for this account?')
      cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click()
      cy.get('.my-5 > :nth-child(3) > :nth-child(1) > div').contains('2FA disabled')
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