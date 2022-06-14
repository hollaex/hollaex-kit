import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{
      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('I enter credentials {string},{string}',(username,password)=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(username+Cypress.env('NEW_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
})

Then ('I should be able to login successfully as {string}',(username)=>{

     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
    .should('contain',username)
})

And ('I have title of {string}',(role)=>{

    cy.get('a > .pl-1').click()
    cy.get('.sub-label').should('contain',role)
})

Then ('I must be able to do Communicators tasks',()=>{

     cy.contains('Users').click({force: true})
     cy.contains('All Users').click({force: true})
     cy.get('#rc-tabs-0-panel-users > .app_container-content > :nth-child(1) > :nth-child(1)').
     should('contain','Forbidden')

    cy.contains('Assets').click({force: true})
    cy.get('.ant-message-notice-content').should('contain','Access denied:')
    
    cy.get('.green-btn').click()
    cy.contains('Add your asset').click({force: true})
    cy.get(':nth-child(1) > .ant-radio > .ant-radio-inner').click({force: true})
    cy.contains('Next').click()
    cy.contains('Assets').click({force: true})
    
    cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click({force: true})
    cy.contains('Next').click()
    cy.get('#AssetConfigForm_contract').type('123')
    cy.contains('Next').click()
    cy.get('.ant-message-notice-content').should('contain','Access denied:')
    cy.get('.ant-modal-close-x').click()
    
    cy.contains('Summary').click()
    cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
    
    cy.contains('Deposits').click()
    cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
    cy.contains('Withdrawals').click()
    cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
    
    cy.contains('Markets').click({force: true})
    //cy.get('.ant-message-notice-content').should('contain','Access denied:')
    
    // cy.contains('OrderBook').click({force: true})
    // cy.contains('Create/add market').click({force: true})
    // cy.contains('Create a new market').click({force: true})
    // cy.get('.footer-info > a').click({force: true})
    // cy.get('.app_container-content > :nth-child(1) > .ant-alert-description')
    // .should('contain','Access denied:')
    
    cy.contains('Tiers').click({force: true})
    cy.contains('Adjust fees').click({force: true})
    cy.get(':nth-child(1) > :nth-child(2) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
    .type('{upArrow}{upArrow}{upArrow}')
    cy.contains('Confirm').click({force: true})
    cy.get('.ant-message-notice-content')
    .should('contain','Access denied:')
    cy.get('.ant-modal-close-x').click()
    
    cy.contains('Roles').click({force: true})
    cy.contains('Add operator').click({force: true})
    cy.get('#OperatorRoleFrom_email').type('support#testsae.com')
    cy.contains('Save').click({force: true})
    cy.get('.ant-message-notice-content')
    .should('contain','Access denied:')
    cy.get('.ant-modal-close-x').click().wait(5000)
                  
    cy.contains('Chat').click({force: true})
    cy.reload()
    cy.get('.label-inactive').invoke('text')
    .then(text => {
          cy.log('second', text)     
           if(text.includes('On')){ cy.get('.ant-switch').click({force:true}).wait(2000)}     
           })
    const randomTest= Math.random().toString(36).substring(2,6);
    cy.get('.ant-input').type(randomTest)
    cy.contains('SEND').click({force: true})
    cy.contains(randomTest).should('exist')
    
//     cy.contains('Cc fee settlement').click({force: true})
//     cy.get('.ant-message-notice-content')
//     .should('contain','Access denied:')
    
    cy.contains('Announcements').click({force: true})
    cy.get('.ant-message-notice-content')
    .should('contain','Access denied:')
    
    cy.contains('Automatic tier upgrade').click({force: true})
    cy.get('.ant-message-notice-content')
    .should('contain','Access denied:')
})

Then ('I must be able to do KYCs tasks',()=>{

     cy.contains('Users').click({force: true})
     cy.get('.ant-input-number-input').type('191')
     cy.get('.ant-btn').click()
     cy.contains('Delete').click({force: true})
     cy.contains('Are you sure want to delete this?').should('exist')
     cy.contains('OK').click({force: true})
     //Delete does not work
     
     cy.contains('Edit').click({force: true})
     const randomNote= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').clear().type(randomNote)
     cy.contains('Submit').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     //cy.get('.about-notes-text').should('contain',randomNote)
     
     cy.get(':nth-child(1) > .about-info-content > .info-link').as('Adjust').click({force: true})
     cy.get('#user-discount-form_feeDiscount')
     .type('{upArrow}{upArrow}{upArrow}')
     cy.contains('Next').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     cy.reload()
     // cy.get(':nth-child(6) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     // .click()
          
     cy.get('.user-info-container > :nth-child(2) > .ant-btn').as('userInfo').click()
     cy.get(':nth-child(2) > :nth-child(2) > .d-flex > .ant-input').as('Full Name')
     .type(Math.random().toString(36).substring(2,6))
     cy.contains('SAVE').click({force: true})
     cy.get('.user_data > :nth-child(11)')
     .should('contain','Access denied:')
     cy.reload()
     // cy.get(':nth-child(6) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     // .click()
     
     cy.contains('Flag user').click({force: true})
     cy.contains('Are you sure want to flag this user?').should('exist')
     cy.contains('OK').click({force: true})
     cy.get(':nth-child(5) > .about-info-content > .info-link')
     .should('contain','Unflag user').click({force: true})
     cy.contains('Are you sure want to unflag this user?').should('exist').wait(3000)
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click({ multiple: true }).wait(3000)
     cy.get(':nth-child(5) > :nth-child(1) > .info-link')
     .should('contain','Flag user')
     
     cy.contains('Freeze account').click({force:true})
     cy.contains('Are you sure want to freeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.contains('Unfreeze').click({force:true})
     cy.contains('Are you sure want to unfreeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.get(':nth-child(4) > :nth-child(1) > .info-link').should('contain','Freeze account')
     
     cy.contains('Assets').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     
     cy.get('.green-btn').click()
     cy.contains('Add your asset').click({force: true})
     cy.get(':nth-child(1) > .ant-radio > .ant-radio-inner').click({force: true})
     cy.contains('Next').click()
     cy.contains('Assets').click({force: true})
          
     cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click({force: true})
     cy.contains('Next').click()
     cy.get('#AssetConfigForm_contract').type('123')
     cy.contains('Next').click()
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
    cy.get('.ant-modal-close-x')
    //cy.get(':nth-child(12) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     .click()
     
     cy.contains('Summary').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
     cy.contains('Deposits').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
      
     cy.contains('Withdrawals').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
     cy.contains('Markets').click({force: true})
     //cy.get('.ant-message-notice-content').should('contain','Access denied:')
     
     // cy.contains('Public markets').click({force: true})
     // cy.contains('OTCdesk').click({force: true})
     // cy.contains('Create/add market').click({force: true})
     // cy.contains('Create a new market').click({force: true})
     // cy.get('.footer-info > a').click({force: true})
     // cy.get('.app_container-content > :nth-child(1) > .ant-alert-description')
     // .should('contain','Access denied:')
     
     cy.contains('Tiers').click({force: true})
     cy.contains('Adjust fees').click({force: true})
     cy.get(':nth-child(1) > :nth-child(2) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
     .type('{upArrow}{upArrow}{upArrow}')
     cy.contains('Confirm').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
    cy.get('.ant-modal-close-x')
   //cy.get(':nth-child(12) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     .click()
     
     cy.contains('Roles').click({force: true})
     cy.contains('Add operator').click({force: true})
     cy.get('#OperatorRoleFrom_email').type('support#testsae.com')
     cy.contains('Save').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
          
     cy.contains('Chat').click({force: true})
     const randomTest= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').type(randomTest)
     cy.contains('SEND').click({force: true})
     cy.contains(randomTest).should('exist')
     // cy.get('.ant-switch').click({force:true})
     
     // cy.contains('Cc fee settlement').click({force: true})
     // cy.get('.ant-message-notice-content')
     // .should('contain','Access denied:')
     
     cy.contains('Announcements').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     
     cy.contains('Automatic tier upgrade').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
})

Then ('I must be able to do Supports tasks',()=>{

     cy.contains('Users').click({force: true})
     cy.get('.ant-input-number-input').type('191')
     cy.get('.ant-btn').click()
     cy.contains('Delete').click({force: true})
     cy.contains('Are you sure want to delete this?').should('exist')
     cy.contains('OK').click({force: true})
     //Delete does not work
     
     cy.contains('Edit').click({force: true})
     const randomNote= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').clear().type(randomNote)
     cy.contains('Submit').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied: User is not authorized to access this endpoint')
     cy.get('.ant-modal-close-x').click()
     //cy.get('.about-notes-text').should('contain',randomNote)
     
     cy.get(':nth-child(1) > .about-info-content > .info-link').as('Adjust').click({force: true})
     cy.get('#user-discount-form_feeDiscount')
     .type('{upArrow}{upArrow}{upArrow}')
     cy.contains('Next').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.reload()
     // cy.get(':nth-child(6) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     // .click()
     
     
     cy.get('.user-info-container > :nth-child(2) > .ant-btn').as('userInfo').click()
     cy.get(':nth-child(2) > :nth-child(2) > .d-flex > .ant-input').as('Full Name')
     .type(Math.random().toString(36).substring(2,6))
     cy.contains('SAVE').click({force: true})
     cy.get('.user_data > :nth-child(11)')
     .should('contain','Access denied:')
     cy.reload()
     // cy.get(':nth-child(6) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     // .click()
     
     cy.contains('Flag user').click({force: true})
     cy.contains('Are you sure want to flag this user?').should('exist')
     cy.contains('OK').click({force: true})
     cy.get(':nth-child(5) > .about-info-content > .info-link')
     .should('contain','Unflag user').click({force: true})
     cy.contains('Are you sure want to unflag this user?').should('exist').wait(3000)
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click({ multiple: true }).wait(3000)
     //cy.contains('OK').click({force: true})
     cy.get(':nth-child(5) > :nth-child(1) > .info-link')
     .should('contain','Flag user')
     
     cy.contains('Freeze account').click({force:true})
     cy.contains('Are you sure want to freeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.contains('Unfreeze').click({force:true})
     cy.contains('Are you sure want to unfreeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.get(':nth-child(4) > :nth-child(1) > .info-link').should('contain','Freeze account')
     
     cy.contains('Assets').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     
     cy.get('.green-btn').click()
     cy.contains('Add your asset').click({force: true})
     cy.get(':nth-child(1) > .ant-radio > .ant-radio-inner').click({force: true})
     cy.contains('Next').click()
     cy.contains('Assets').click({force: true})
     
     
     cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click({force: true})
     cy.contains('Next').click()
     cy.get('#AssetConfigForm_contract').type('123')
     cy.contains('Next').click()
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Summary').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
     cy.contains('Deposits').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
      
     cy.contains('Withdrawals').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
     cy.contains('Markets').click({force: true})
     //cy.get('.ant-message-notice-content').should('contain','Access denied:')
     
     // cy.contains('OrderBook').click({force: true})
     // cy.contains('Create/add market').click({force: true})
     // cy.contains('Create a new market').click({force: true})
     // cy.get('.footer-info > a').click({force: true})
     // cy.get('.app_container-content > :nth-child(1) > .ant-alert-description')
     // .should('contain','Access denied:')
     
     cy.contains('Tiers').click({force: true})
     cy.contains('Adjust fees').click({force: true})
     cy.get(':nth-child(1) > :nth-child(2) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
     .type('{upArrow}{upArrow}{upArrow}')
     cy.contains('Confirm').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Roles').click({force: true})
     cy.contains('Add operator').click({force: true})
     cy.get('#OperatorRoleFrom_email').type('support#testsae.com')
     cy.contains('Save').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     
     
     cy.contains('Chat').click({force: true})
     const randomTest= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').type(randomTest)
     cy.contains('SEND').click({force: true})
     cy.contains(randomTest).should('exist')
     // cy.get('.ant-switch').click({force:true})
     
     // cy.contains('Cc fee settlement').click({force: true})
     // cy.get('.ant-message-notice-content')
     // .should('contain','Access denied:')
     
     cy.contains('Announcements').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     
     cy.contains('Automatic tier upgrade').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')

})

Then ('I must be able to do Supervisors tasks',()=>{
  
     cy.contains('Users').click({force: true})
     cy.get('.ant-input-number-input').type('191')
     cy.get('.ant-btn').click()
     cy.contains('Delete').click({force: true})
     cy.contains('Are you sure want to delete this?').should('exist')
     cy.contains('OK').click({force: true})
     //Delete does not work
     
     cy.contains('Edit').click({force: true})
     const randomNote= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').clear().type(randomNote)
     cy.contains('Submit').click({force: true})
     cy.get('.verification_data_container > :nth-child(1) > :nth-child(1) > .d-flex > div')
      cy.get('.ant-message-notice-content')
     .should('contain','Data saved successfully')
    // cy.get('.about-notes-text')
     cy.get('.verification_data_container > :nth-child(1) > :nth-child(1) > .d-flex > div')
     .should('contain',randomNote)
     
     cy.get(':nth-child(1) > .about-info-content > .info-link').as('Adjust').click({force: true})
     cy.get('#user-discount-form_feeDiscount')
     .type('{upArrow}{upArrow}{upArrow}')
     cy.contains('Next').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
          
     cy.get('.user-info-container > :nth-child(2) > .ant-btn').as('userInfo').click()
     cy.get(':nth-child(2) > :nth-child(2) > .d-flex > .ant-input').as('Full Name')
     .clear().type(Math.random().toString(36).substring(2,6))
     cy.contains('SAVE').click({force: true})
     cy.get('.user_data > :nth-child(11)')
     cy.get('.ant-notification-notice-message').should('contain','Success')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Flag user').click({force: true})
     cy.contains('Are you sure want to flag this user?').should('exist')
     cy.contains('OK').click({force: true})
     cy.get(':nth-child(5) > .about-info-content > .info-link')
     .should('contain','Unflag user').click({force: true})
     cy.contains('Are you sure want to unflag this user?').should('exist').wait(3000)
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click({ force: true }).wait(3000)
     cy.get(':nth-child(5) > :nth-child(1) > .info-link')
     .should('contain','Flag user')
     
     cy.contains('Freeze account').click({force:true})
     cy.contains('Are you sure want to freeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.contains('Unfreeze').click({force:true})
     cy.contains('Are you sure want to unfreeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.get(':nth-child(4) > :nth-child(1) > .info-link').should('contain','Freeze account')
     
     cy.contains('Assets').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     
     cy.get('.green-btn').click()
     cy.contains('Add your asset').click({force: true})
     cy.get(':nth-child(1) > .ant-radio > .ant-radio-inner').click({force: true})
     cy.contains('Next').click()
     cy.contains('Assets').click({force: true})
          
     cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click({force: true})
     cy.contains('Next').click()
     cy.get('#AssetConfigForm_contract').type('123')
     cy.contains('Next').click()
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Summary').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
     cy.contains('Deposits').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
      
     cy.contains('Withdrawals').click()
     cy.get('.app_container-content > :nth-child(1) > .ant-alert-description').should('contain','Access denied:')
     
     cy.contains('Markets').click({force: true})
     //cy.get('.ant-message-notice-content').should('contain','Access denied:')
     
     // cy.contains('OrderBook').click({force: true})
     // cy.contains('Create/add market').click({force: true})
     // cy.contains('Create a new market').click({force: true})
     // cy.get('.footer-info > a').click({force: true})
     // cy.get('.app_container-content > :nth-child(1) > .ant-alert-description')
     // .should('contain','Access denied:')
     
     cy.contains('Tiers').click({force: true})
     cy.contains('Adjust fees').click({force: true})
     cy.get(':nth-child(1) > :nth-child(2) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
     .type('{upArrow}{upArrow}{upArrow}')
     cy.contains('Confirm').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Roles').click({force: true})
     cy.contains('Add operator').click({force: true})
     cy.get('#OperatorRoleFrom_email').type('support#testsae.com')
     cy.contains('Save').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.get('.ant-modal-close-x').click()
     
     
     cy.contains('Chat').click({force: true})
     const randomTest= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').type(randomTest)
     cy.contains('SEND').click({force: true})
     cy.contains(randomTest).should('exist')
     // cy.get('.ant-switch').click({force:true})
     
     // cy.contains('Cc fee settlement').click({force: true})
     // cy.get('.ant-message-notice-content')
     // .should('contain','Access denied:')
     
     cy.contains('Announcements').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     
     cy.contains('Automatic tier upgrade').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')

})




