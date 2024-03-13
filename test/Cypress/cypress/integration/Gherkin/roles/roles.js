import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am in the Hollaex login page',()=>{
      cy.visit(Cypress.env('LOGIN_PAGE'))
})

When ('I enter credentials {string},{string}',(username,password)=>{

     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type('tester+'+username+Cypress.env('NEW_USER'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
})

Then ('I should be able to login successfully as {string}',(username)=>{

     cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
    .should('contain',username)
})

And ('I have title of {string}',(role)=>{

    cy.get('a > .pl-1').click()
    cy.get('.sub-label').should('contain',role)
})

Then ('I must be able to do Communicators tasks',()=>{
     cy.contains('Users').click({force: true})
     cy.contains('-Access denied: User is not authorized to access this endpoint-')
     cy.get(':nth-child(1) > .ant-input').clear().type('1')
     cy.get(':nth-child(2) > .ant-btn').click()
     cy.get('.ant-empty-description').contains('No Data')
     cy.contains('Add new user').click()
     const randomUsername = Math.random().toString(36).substring(2,6);
     const Rusername = "tester+"+randomUsername+Cypress.env('NEW_USER')
     cy.get('#addUser_userEmail').clear().type(Rusername)
     cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
     cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
     cy.get('[type="submit"]').click()
     cy.get('.ant-message-notice-content')
     .contains("Access denied: User is not authorized to access this endpoint")
                
    cy.contains('Chat').click({force: true})
    cy.get('.label-inactive').invoke('text')
    .then(text => {
          cy.log('second', text)     
           if(text.includes('On')){ cy.get('.ant-switch').click({force:true}).wait(2000)}     
           })
    const randomTest= Math.random().toString(36).substring(2,6);
    cy.get('.ant-input').type(randomTest)
    cy.contains('SEND').click({force: true})
    cy.contains(randomTest).should('exist')

})

Then ('I must be able to do KYCs tasks',()=>{

     cy.contains('Users').click({force: true})
     cy.contains('Add new user').click()
     const randomUsername = Math.random().toString(36).substring(2,6);
     const Rusername = "tester+"+randomUsername+Cypress.env('NEW_USER')
     cy.get('#addUser_userEmail').clear().type(Rusername)
     cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
     cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
     cy.get('[type="submit"]').click()
     cy.get('.ant-message-notice-content')
     .contains("Access denied: User is not authorized to access this endpoint")
     cy.get('.mr-5').click()
     cy.reload()
     cy.get(':nth-child(1) > .ant-input').clear().type('191')
     cy.get(':nth-child(2) > .ant-btn').click()
     cy.wait(5000)
     cy.get(':nth-child(8) > .ant-btn').click()

     cy.get('.about-notes-content > .d-flex > .green-btn').click()
     const randomNote= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').clear().type(randomNote)
     cy.get('div.w-100 > .ant-btn').click()
     cy.get('.ant-notification-notice').contains('Success')
     cy.get('.about-notes-text').contains(randomNote)
     cy.contains('Delete').click({force: true})
     cy.contains('Are you sure want to delete this?').should('exist')
     cy.contains('OK').click({force: true})
     cy.wait(3000)
     cy.contains(randomNote).should('not.exist');
     
     
     cy.contains('Edit').click({force: true})
     const randomNoteForEdit= Math.random().toString(36).substring(2,6);
     cy.get('#number').clear().type(randomNoteForEdit)
     cy.contains('Submit').click({force: true})
     cy.get('.ant-message-notice-content').contains('Data saved successfully')
     //cy.get('.ant-modal-close-x').click()
    
     
     cy.contains('Adjust').click({force: true})
     // cy.wait(4000)
     cy.get('#user-discount-form_feeDiscount')
     .type('{upArrow}{upArrow}{upArrow}').wait(3000).type('9').type('{backspace}')//.type('{enter}')
     cy.contains('Next').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click()
     cy.get('.ant-message-notice-content').should('contain','Access denied:')
     cy.reload()
   
          
     cy.get('.user-info-container > :nth-child(2) > .ant-btn').as('userInfo').click()
     const randEmail = Math.random().toString(36).substring(2,6)
     cy.get('.ant-input').as('FullName')
     .type(randEmail)
     cy.contains('Proceed').should('be.disabled');
     cy.get('@FullName').type('@hollaex.email');
     cy.contains('Proceed').should('be.enabled').click()
     cy.get('.mt-3').contains(randEmail+"@hollaex.email")
     cy.contains('Yes, Correct, Proceed').click()
     cy.contains('Change user email').should('be.visible')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Flag user').click({force: true})
     cy.contains('Are you sure want to flag this user?').should('exist')
     cy.contains('OK').click({force: true})
     cy.get(':nth-child(6) > .about-info-content > .info-link')
     .should('contain','Unflag user').click({force: true})
     cy.contains('Are you sure want to unflag this user?').should('exist').wait(3000)
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click({ multiple: true }).wait(3000)
     cy.get(':nth-child(6) > :nth-child(1) > .info-link')
     .should('contain','Flag user')
     
     cy.contains('Freeze account').click({force:true})
     cy.contains('Are you sure want to freeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.contains('Unfreeze').click({force:true})
     cy.contains('Are you sure want to unfreeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.get(':nth-child(5) > :nth-child(1) > .info-link').should('contain','Freeze account')

     cy.get('.ml-4 > .ant-btn').click()
     const num = Math.floor(Math.random() * 5) + 1;
     cy.get('.ant-select-selection-item').type('{downarrow}'.repeat(num) + '{enter}');
     cy.get('.ant-select-selection-item').invoke('text').then((text) => {
     cy.log(text);
    const str = text
    const regex = /(\d+)/;
    const match = str.match(regex);
    const accountTier = match && match[1];
    console.log(accountTier);
    cy.get('div.w-100 > .ant-btn').click()
     cy.get('.user-level-container > .user-info-label').contains(accountTier)

    })
    cy.reload()
    cy.get('#rc-tabs-0-tab-bank').click()
    cy.contains('Add bank').click()
    cy.get('.ant-select-selector').click().type('{downarrow}{enter}')
    cy.get('.ant-modal-footer > .ant-btn-primary').click()
    cy.get(':nth-child(1) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
    cy.get(':nth-child(2) > :nth-child(2) > .d-flex > .ant-input').clear().type('123456')
    cy.get(':nth-child(3) > :nth-child(2) > .d-flex > .ant-input').clear().type('123456')
    cy.get('.ant-modal-footer > .ant-btn-primary').click()
    cy.get('.ant-notification-notice').contains('Success')
    cy.contains('123456')
    cy.get('.ant-card-extra > .anticon > svg').click()
    cy.get('.ant-popover-buttons > .ant-btn-primary').click()
    cy.get('.ant-message-notice-content').contains('Bank deleted')
    cy.contains('123456').should('not.exist');
     
    cy.get('#rc-tabs-0-tab-orders').click()
    cy.contains('Download table').should('not.exist')
    cy.get('#rc-tabs-0-tab-trade').click()
    cy.contains('Download table')
    cy.get('#rc-tabs-0-tab-deposits').click()
    cy.contains('Download transactions')
    cy.get('#rc-tabs-0-tab-withdrawals').click()
    cy.contains('Download transactions')
    cy.get('#rc-tabs-0-tab-referrals').click()
    cy.get('.ant-spin-dot').should('exist')
    cy.get('#rc-tabs-0-tab-meta').click()
    //edit is not allowed
    cy.get('.justify-content-between > .ant-btn').click()
    cy.get(':nth-child(1) > .d-flex > .ant-btn').click()
    cy.get('.input_field > :nth-child(1) > .ant-select > .ant-select-selector').click().type('{downarrow}{downarrow}{enter}')
    cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click()
    cy.get(':nth-child(3) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
    cy.get(':nth-child(4) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
    cy.get('.modal-wrapper > :nth-child(3) > :nth-child(3)').click()
    cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.modal-wrapper > :nth-child(3) > :nth-child(1)').click()
    
    cy.get('.ant-table-row > :nth-child(5) > div > :nth-child(1)').click()
    const edit= Math.random().toString(36).substring(2,6);
    cy.get(':nth-child(4) > :nth-child(2) > .d-flex > .ant-input').clear().type(edit)
    cy.get('.modal-wrapper > :nth-child(3) > :nth-child(3)').click()
    cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.modal-wrapper > :nth-child(3) > :nth-child(1)').click()
    cy.wait(3000)
    //remove
    cy.get('.ant-table-row > :nth-child(5) > div > :nth-child(2)').click()
    cy.get('.title').contains('Remove Meta')
    cy.get('.modal-wrapper > .d-flex > :nth-child(3)').click()
    cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.modal-wrapper > .d-flex > :nth-child(1)').click()
    
    cy.get(':nth-child(3) > .ant-breadcrumb-link > a').click()
    cy.get('#rc-tabs-0-tab-about').click()
    
    cy.get('a > .ant-btn').click()
    cy.contains('Summary')
    cy.get('a > .pl-1').click()     
    cy.contains('Chat').click({force: true})
    const randomTest= Math.random().toString(36).substring(2,6);
    cy.get('.ant-input').type(randomTest)
    cy.contains('SEND').click({force: true})
    cy.contains(randomTest).should('exist')

})

Then ('I must be able to do Supports tasks',()=>{

     cy.contains('Users').click({force: true})
     cy.contains('Add new user').click()
     const randomUsername = Math.random().toString(36).substring(2,6);
     const Rusername = "tester+"+randomUsername+Cypress.env('NEW_USER')
     cy.get('#addUser_userEmail').clear().type(Rusername)
     cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
     cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
     cy.get('[type="submit"]').click()
     cy.get('.ant-message-notice-content')
     .contains("Access denied: User is not authorized to access this endpoint")
     cy.get('.mr-5').click()
     cy.reload()
     cy.get(':nth-child(1) > .ant-input').clear().type('191')
     cy.get(':nth-child(2) > .ant-btn').click()
     cy.wait(5000)
     cy.get(':nth-child(8) > .ant-btn').click()
     cy.get('.about-notes-content > .d-flex > .green-btn').click()
     const randomNote= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').clear().type(randomNote)
     cy.get('div.w-100 > .ant-btn').click()
     cy.get('.ant-notification-notice').contains('Data')
     cy.get('.about-notes-text').contains(randomNote)
     cy.contains('Delete').click({force: true})
     cy.contains('Are you sure want to delete this?').should('exist')
     cy.contains('OK').click({force: true})
     cy.wait(3000)
     cy.contains(randomNote).should('not.exist');
     
     cy.contains('Edit').click({force: true})
     const randomNoteForeEdite= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').clear().type(randomNoteForeEdite)
     cy.contains('Submit').click({force: true})
     cy.get('.ant-message-notice-content').should('contain','Access denied: User is not authorized to access this endpoint')
     // cy.get('.ant-modal-close-x').click()
     //cy.get('.about-notes-text').should('contain',randomNote)
     cy.reload()

     cy.contains('Adjust').click({force: true})
    cy.get('#user-discount-form_feeDiscount')
     .type('{upArrow}{upArrow}{upArrow}').wait(3000).type('9').type('{backspace}')//.type('{enter}')
     cy.contains('Next').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click({force: true})
     cy.get('.ant-message-notice-content')
     .should('contain','Access denied:')
     cy.reload()
     // cy.get(':nth-child(6) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-close > .ant-modal-close-x')
     // .click()
     
     
     cy.get('.user-info-container > :nth-child(2) > .ant-btn').as('userInfo').click()
     const randEmail = Math.random().toString(36).substring(2,6)
     cy.get('.ant-input').as('FullName')
     .type(randEmail)
     cy.contains('Proceed').should('be.disabled');
     cy.get('@FullName').type('@hollaex.email');
     cy.contains('Proceed').should('be.enabled').click()
     cy.get('.mt-3').contains(randEmail+"@hollaex.email")
     cy.contains('Yes, Correct, Proceed').click()
     cy.contains('Change user email').should('be.visible')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Flag user').click({force: true})
     cy.contains('Are you sure want to flag this user?').should('exist')
     cy.contains('OK').click({force: true})
     cy.get(':nth-child(6) > .about-info-content > .info-link')
     .should('contain','Unflag user').click({force: true})
     cy.contains('Are you sure want to unflag this user?').should('exist').wait(3000)
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click({ multiple: true }).wait(3000)
     //cy.contains('OK').click({force: true})
     cy.get(':nth-child(6) > :nth-child(1) > .info-link')
     .should('contain','Flag user')
     
     cy.contains('Freeze account').click({force:true})
     cy.contains('Are you sure want to freeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.contains('Unfreeze').click({force:true})
     cy.contains('Are you sure want to unfreeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.get(':nth-child(5) > :nth-child(1) > .info-link').should('contain','Freeze account')
     cy.get('.ml-4 > .ant-btn').click()
     const num = Math.floor(Math.random() * 5) + 1;
     cy.get('.ant-select-selection-item').type('{downarrow}'.repeat(num) + '{enter}');
     cy.get('.ant-select-selection-item').invoke('text').then((text) => {
       cy.log(text);
       const str = text
     const regex = /(\d+)/;
     const match = str.match(regex);
     const accountTier = match && match[1];
     console.log(accountTier);
     cy.get('div.w-100 > .ant-btn').click()
     //cy.get('.user-level-container > .user-info-label').contains(accountTier)
     cy.contains('Access denied: User is not authorized to access this endpoint')
     })
     cy.reload()
     cy.get('#rc-tabs-0-tab-bank').click()
     cy.contains('Add bank').click()
     cy.get('.ant-select-selector').click().type('{downarrow}{enter}')
     cy.get('.ant-modal-footer > .ant-btn-primary').click()
     cy.get(':nth-child(1) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
     cy.get(':nth-child(2) > :nth-child(2) > .d-flex > .ant-input').clear().type('123456')
     cy.get(':nth-child(3) > :nth-child(2) > .d-flex > .ant-input').clear().type('123456')
     cy.get('.ant-modal-footer > .ant-btn-primary').click()
     cy.get('.ant-modal-body > :nth-child(7) > strong')
     .should('contain','Access denied: User is not authorized to access this endpoint')
     cy.get('.ant-modal-close-x').click()
    //  cy.get('.ant-notification-notice').contains('Success')
    //  cy.contains('123456')
    //  cy.get('.ant-card-extra > .anticon > svg').click()
    //  cy.get('.ant-popover-buttons > .ant-btn-primary').click()
    //  cy.get('.ant-message-notice-content').contains('Bank deleted')
    //  cy.contains('123456').should('not.exist');
     
     cy.get('#rc-tabs-0-tab-orders').click()
     cy.contains('Download table')
     cy.get('#rc-tabs-0-tab-trade').click()
     cy.contains('Download table')
     cy.get('#rc-tabs-0-tab-deposits').click()
     cy.contains('Download transactions')
     cy.get('#rc-tabs-0-tab-withdrawals').click()
     cy.contains('Download transactions')
     cy.get('#rc-tabs-0-tab-referrals').click()
     cy.get('.ant-spin-dot').should('exist')
     cy.get('#rc-tabs-0-tab-meta').click()
     //edit is not allowed
     cy.get('.justify-content-between > .ant-btn').click()
     cy.get(':nth-child(1) > .d-flex > .ant-btn').click()
     cy.get('.input_field > :nth-child(1) > .ant-select > .ant-select-selector').click().type('{downarrow}{downarrow}{enter}')
     cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click()
     cy.get(':nth-child(3) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
     cy.get(':nth-child(4) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(3)').click()
     cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(1)').click()
     
     cy.get('.ant-table-row > :nth-child(5) > div > :nth-child(1)').click()
     cy.get(':nth-child(4) > :nth-child(2) > .d-flex > .ant-input').clear().type('edit')
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(3)').click()
     cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(1)').click()
     //remove
     cy.get('.ant-table-row > :nth-child(5) > div > :nth-child(2)').click()
     cy.get('.title').contains('Remove Meta')
     cy.get('.modal-wrapper > .d-flex > :nth-child(3)').click()
     cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
     cy.get('.modal-wrapper > .d-flex > :nth-child(1)').click()
     
     cy.get(':nth-child(3) > .ant-breadcrumb-link > a').click()
     cy.get('#rc-tabs-0-tab-about').click()

     cy.get('a > .ant-btn').click()
     cy.contains('Summary')
     cy.get('a > .pl-1').click()     
     cy.contains('Chat').click({force: true})
     const randomTest= Math.random().toString(36).substring(2,6);
     cy.get('.ant-input').type(randomTest)
     cy.contains('SEND').click({force: true})
     cy.contains(randomTest).should('exist')

     cy.wait(10000)
     
})

Then ('I must be able to do Supervisors tasks',()=>{
  
     cy.contains('Users').click({force: true})
     cy.contains('Add new user').click()
     const randomUsername = Math.random().toString(36).substring(2,6);
     const Rusername = "tester+"+randomUsername+Cypress.env('NEW_USER')
     cy.get('#addUser_userEmail').clear().type(Rusername)
     cy.get('#addUser_password').clear().type(Cypress.env('PASSWORD'))
     cy.get('#addUser_confirmPassword').clear().type(Cypress.env('PASSWORD'))
     cy.get('[type="submit"]').click()
     cy.get('.ant-message-notice-content')
     .contains("Access denied: User is not authorized to access this endpoint")
     cy.get('.mr-5').click()
     cy.reload()
     cy.get(':nth-child(1) > .ant-input').clear().type('191')
     cy.get(':nth-child(2) > .ant-btn').click()
     cy.wait(5000)
     cy.get(':nth-child(8) > .ant-btn').click()
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
     
     cy.contains('Adjust').click()
     cy.get('#user-discount-form_feeDiscount')
     .type('{upArrow}{upArrow}{upArrow}').wait(3000).type('9').type('{backspace}')//.type('{enter}')
     cy.contains('Next').click()
     cy.get('.button-wrapper > :nth-child(2)').as('Apply').click()
     cy.get('.ant-message-notice-content').should('contain','Discount added successfully')
     //cy.get('.ant-modal-close-x').click()
          
     cy.get('.user-info-container > :nth-child(2) > .ant-btn').as('userInfo').click()
     const randEmail = Math.random().toString(36).substring(2,6)
     cy.get('.ant-input').as('FullName')
     .type(randEmail)
     cy.contains('Proceed').should('be.disabled');
     cy.get('@FullName').type('@hollaex.email');
     cy.contains('Proceed').should('be.enabled').click()
     cy.get('.mt-3').contains(randEmail+"@hollaex.email")
     cy.contains('Yes, Correct, Proceed').click()
     cy.contains('Change user email').should('be.visible')
     cy.get('.ant-modal-close-x').click()
     
     cy.contains('Flag user').click({force: true})
     cy.contains('Are you sure want to flag this user?').should('exist')
     cy.contains('OK').click({force: true})
     cy.get(':nth-child(6) > .about-info-content > .info-link')
     .should('contain','Unflag user').click({force: true})
     cy.contains('Are you sure want to unflag this user?').should('exist').wait(3000)
     cy.get('.ant-modal-confirm-btns > .ant-btn-primary').click({ force: true }).wait(3000)
     cy.get(':nth-child(6) > :nth-child(1) > .info-link')
     .should('contain','Flag user')
     
     cy.contains('Freeze account').click({force:true})
     cy.contains('Are you sure want to freeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.contains('Unfreeze').click({force:true})
     cy.contains('Are you sure want to unfreeze this account?').should('exist')
     cy.contains('OK').click({force:true}).wait(3000)
     cy.get(':nth-child(5) > :nth-child(1) > .info-link').should('contain','Freeze account')
     
     
     cy.get('.ml-4 > .ant-btn').click()
     const num = Math.floor(Math.random() * 5) + 1;
     cy.get('.ant-select-selection-item').type('{downarrow}'.repeat(num) + '{enter}');
     cy.get('.ant-select-selection-item').invoke('text').then((text) => {
       cy.log(text);
       const str = text
     const regex = /(\d+)/;
     const match = str.match(regex);
     const accountTier = match && match[1];
     console.log(accountTier);
     cy.get('div.w-100 > .ant-btn').click()
     cy.get('.user-level-container > .user-info-label').contains(accountTier)
     })
     
     cy.reload()
     cy.get('#rc-tabs-0-tab-bank').click()
     cy.contains('Add bank').click()
     cy.get('.ant-select-selector').click().type('{downarrow}{enter}')
     cy.get('.ant-modal-footer > .ant-btn-primary').click()
     cy.get(':nth-child(1) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
     cy.get(':nth-child(2) > :nth-child(2) > .d-flex > .ant-input').clear().type('123456')
     cy.get(':nth-child(3) > :nth-child(2) > .d-flex > .ant-input').clear().type('123456')
     cy.get('.ant-modal-footer > .ant-btn-primary').click()
     cy.get('.ant-notification-notice').contains('Success')
     cy.contains('123456')
     cy.get('.ant-card-extra > .anticon > svg').click()
     cy.get('.ant-popover-buttons > .ant-btn-primary').click()
     cy.get('.ant-message-notice-content').contains('Bank deleted')
     cy.contains('123456').should('not.exist');
     
     cy.get('#rc-tabs-0-tab-balance').click()
     cy.get('[data-row-key="1"] > .ant-table-row-expand-icon-cell').click()
     cy.get('.generate-link').should('exist')
     cy.get('#rc-tabs-0-tab-orders').click()
     cy.contains('Download table')
     cy.get('#rc-tabs-0-tab-trade').click()
     cy.contains('Download table')
     cy.get('#rc-tabs-0-tab-deposits').click()
     cy.contains('Download transactions')
     cy.get('#rc-tabs-0-tab-withdrawals').click()
     cy.contains('Download transactions')
     cy.get('#rc-tabs-0-tab-referrals').click()
     cy.get('.ant-spin-dot').should('exist')
     cy.get('#rc-tabs-0-tab-meta').click()
     //edit is not allowed
     cy.get('.justify-content-between > .ant-btn').click()
     cy.get(':nth-child(1) > .d-flex > .ant-btn').click()
     cy.get('.input_field > :nth-child(1) > .ant-select > .ant-select-selector').click().type('{downarrow}{downarrow}{enter}')
     cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click()
     cy.get(':nth-child(3) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
     cy.get(':nth-child(4) > :nth-child(2) > .d-flex > .ant-input').clear().type('test')
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(3)').click()
     cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(1)').click()
     
     cy.get('.ant-table-row > :nth-child(5) > div > :nth-child(1)').click()
     const edit= Math.random().toString(36).substring(2,6);
     cy.get(':nth-child(4) > :nth-child(2) > .d-flex > .ant-input').clear().type(edit)
     cy.get('.modal-wrapper > :nth-child(3) > :nth-child(3)').click()
     //cy.get('.ant-message-notice-content').contains('Data saved successfully')
     cy.get('.user_meta-form > :nth-child(1) > .admin-user-container > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > .ant-table-row > :nth-child(4)')
     .contains(edit)
     cy.wait(3000)
     //remove
     cy.get('.ant-table-row > :nth-child(5) > div > :nth-child(2)').click()
     cy.get('.title').contains('Remove Meta')
     cy.get('.modal-wrapper > .d-flex > :nth-child(3)').click()
     cy.get('.ant-message-notice-content').contains('Access denied: User is not authorized to access this endpoint')
     cy.get('.modal-wrapper > .d-flex > :nth-child(1)').click()
     
     cy.get(':nth-child(3) > .ant-breadcrumb-link > a').click()
     cy.get('#rc-tabs-0-tab-about').click()
      
          
    cy.get('a > .ant-btn').click()
    cy.contains('Summary')
    cy.get('a > .pl-1').click()     
    cy.contains('Chat').click({force: true})
    const randomTest= Math.random().toString(36).substring(2,6);
    cy.get('.ant-input').type(randomTest)
    cy.contains('SEND').click({force: true})
    cy.contains(randomTest).should('exist')

    cy.contains('Assets').click()
    cy.get('.ant-message-notice-content')
    .contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.green-btn').click()
    //cy.get('.add-asset > span').click()
    //cy.get('.create-asset-btn').click()
    cy.contains('Next').should('be.disabled')
    cy.get('.ant-tabs > .d-flex > :nth-child(2) > :nth-child(1)').click()
    cy.contains('Next').should('be.disabled')
    cy.get('.d-flex > :nth-child(3) > :nth-child(1)').click()
    cy.contains('Next').should('be.disabled')
    cy.contains('Add your asset').click()
    cy.get('.ant-radio-group > :nth-child(1)').click()
    cy.get('.btn-wrapper > :nth-child(3)').click()
    cy.get('.ant-radio-group > :nth-child(2)').click()
    cy.get('.btn-wrapper > :nth-child(3)').click()
    cy.get('#AssetConfigForm_contract').type('Contract')
    cy.get('#AssetConfigForm_fullname').type('FullName')
    cy.get('#AssetConfigForm_symbol').type('short')
    cy.get('.md-field-wrap > .ant-input').type('SHORT')
    cy.contains('Next').click()
    cy.get('.ant-message-notice-content')
    .contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.btn-wrapper > [type="button"]').click()
    cy.get('.btn-wrapper > :nth-child(1)').click()
    cy.get('.ant-radio-group > :nth-child(2) > :nth-child(2)').click()
    cy.get('.btn-wrapper > :nth-child(3)').click()
    cy.get('.btn-wrapper > :nth-child(3)').click()
    cy.get('#AssetConfigForm_fullname').type('FullName')
    cy.get('#AssetConfigForm_symbol').type('short')
    cy.get('.md-field-wrap > .ant-input').type('SHORT')
    cy.contains('Next').click()
    cy.get('.ant-message-notice-content')
    .contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.ant-modal-close-x').click()
    
    //cy.get('#rc-tabs-0-tab-1').click()
    cy.contains('Summary').click()
    cy.get('.app_container-content > :nth-child(1) > .ant-alert-description')
    .contains('Access denied: User is not authorized to access this endpoint')
    cy.get('.ant-card-body > .ant-alert > .ant-alert-description')
    .contains('Access denied: User is not authorized to access this endpoint')
    
    //cy.get('#rc-tabs-0-tab-2').click()
    cy.contains('Wallet').click()
    cy.get('.ant-message-notice-content')
    .contains('Access denied: User is not authorized to access this endpoint')
    cy.contains('No Data')
    
    //cy.get('#rc-tabs-0-tab-3').click()
    cy.contains('Balances').click()
    //need warning
    //cy.get('#rc-tabs-0-tab-4').click()
    cy.contains('Orders').click()
    cy.wait(5000)
    //// The first block logs the initial dataRowKey value.
    // //The second block clicks on the first button in the eighth column.
    // //The third block logs the new dataRowKeyNew value and also checks that it is not the same as the initial dataRowKey value using expect().
    // //This code ensures that the dataRowKey' value is not the same as the previously logged dataRowKey value after performing the specified actions.
    let initialDataRowKey;
    
    cy.get(':nth-child(6) > time').first().then(($element) => {
      initialDataRowKey = $element.closest('[data-row-key]').attr('data-row-key');
      cy.log(initialDataRowKey);
    }).then(() => {
      cy.get(':nth-child(8) > .ant-btn').first().click();
      cy.wait(3000);
    }).then(() => {
      cy.get(':nth-child(6) > time').first().then(($element) => {
        const dataRowKeyNew = $element.closest('[data-row-key]').attr('data-row-key');
        expect(dataRowKeyNew).not.to.equal(initialDataRowKey);
        cy.log(dataRowKeyNew);
      });
});


    //cy.get('#rc-tabs-0-tab-5').click()
    cy.contains('Deposits').click()
    cy.get(':nth-child(3) > .input-container > .ant-input').clear().type(1)
    cy.get('.filters-wrapper-buttons > .ant-btn').click()
    cy.get(':nth-child(2) > .ant-btn > a').each(($element) => {
         cy.wrap($element).should('have.text', '1');
       });
    
       cy.get(':nth-child(3) > .input-container > .ant-input').clear()
       cy.get(':nth-child(4) > .input-container > .ant-input')
       .clear().type('d16b6401-1c83-4d0c-855c-4b0d5f5f141a')
       cy.get('.filters-wrapper-buttons > .ant-btn').click()
       cy.wait(3000)
       cy.get('.ant-table-row > :nth-child(3)')
       .contains('d16b6401-1c83-4d0c-855c-4b0d5f5f141a')
    
       cy.get(':nth-child(3) > .input-container > .ant-input').clear()
       cy.get(':nth-child(4) > .input-container > .ant-input').clear()
       cy.get(':nth-child(5) > .input-container > .ant-input').clear()
       .type('0x97b7b520e553794a610dc25d06414719ffb44a66')
       cy.get('.filters-wrapper-buttons > .ant-btn').click()
       
       cy.get(':nth-child(2) > .ant-btn > a').each(($element) => {
         cy.wrap($element).should('have.text', '173');
       });
       cy.get('[data-row-key="11038"] > :nth-child(4)').invoke('text').then((text) => {
         cy.log(text);
       });
       var firstIndex 
       cy.get('tr > :nth-child(4)').each(($element, index) => {
         cy.wrap($element).invoke('text').then((text) => {
           //cy.log(`Element ${index + 1}: ${text}`);
           if (text.trim() === 'Currency') {
             cy.log(`Element ${index + 1} has the text "Currency"`);
             firstIndex = index + 1
           }
         });
       });
       cy.get('tr > :nth-child(4)').each(($element, index) => {
         if (index >= firstIndex) {
           cy.wrap($element).should('have.text', 'xht');
         }
       });
       
       
       //cy.get('#rc-tabs-0-tab-6').click()
       cy.reload()
       cy.contains('Withdrawals').click()
       cy.wait(5000)
       cy.get(':nth-child(3) > .input-container > .ant-input').clear().type(1)
       cy.get('.filters-wrapper-buttons > .ant-btn').click()
       cy.get(':nth-child(2) > .ant-btn > a').each(($element) => {
       cy.wrap($element).should('have.text', '1');
       });
    
       cy.get(':nth-child(3) > .input-container > .ant-input').clear()
       cy.get(':nth-child(4) > .input-container > .ant-input')
       .clear().type('d16b6401-1c83-4d0c-855c-4b0d5f5f141a')
       cy.get('.filters-wrapper-buttons > .ant-btn').click()
       cy.wait(3000)
       cy.get('.ant-table-row > :nth-child(3)')
       .contains('d16b6401-1c83-4d0c-855c-4b0d5f5f141a')
    
       cy.get(':nth-child(3) > .input-container > .ant-input').clear()
       cy.get(':nth-child(4) > .input-container > .ant-input').clear()
       cy.get(':nth-child(5) > .input-container > .ant-input').clear()
       .type('0x97b7b520e553794a610dc25d06414719ffb44a66')
       cy.get('.filters-wrapper-buttons > .ant-btn').click()
       
    
       //cy.get('#rc-tabs-0-tab-7').click()
       cy.contains('Earnings').click()
       // cy.get('.ant-message-notice-content')
       // .contains('Access denied: User is not authorized to access this endpoint')
       cy.get('.download-btn').should('not.be', 'enabled');
       
       //cy.get('#rc-tabs-0-tab-8').click()
       cy.reload()
       cy.contains('Transfers').click()
       // cy.get('.ant-message-notice-content')
       // .contains('Access denied: User is not authorized to access this endpoint')
       cy.wait(3000)
       cy.get('#rc_select_1')
       //cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selector')
       .click().clear().type('tech@bitholla.com')
       .wait(3000).type('{downarrow}{downarrow}{downarrow}{enter}')
       cy.get('#rc_select_2')
       //cy.get(':nth-child(2) > :nth-child(2) > .ant-select > .ant-select-selector')
       .click().clear().type('alice@hollaex.email')
       .wait(3000).type('{downarrow}{enter}')
       cy.get('.ant-input-number-input').clear().type('1')
       cy.get('.d-flex > .ant-input').clear().type('supervisor test')
       cy.get('div.w-100 > .ant-btn').click()
       cy.get('.d-flex > .ml-2').click()
       cy.get('.ant-message-notice-content')
       .contains('Request failed with status code 403')
       
       //cy.get('#rc-tabs-0-tab-9').click()
       cy.contains('Duster').click()
       var initialId;
       
       cy.get('.w-50.my-3 > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
         .invoke('val')
         .then((text) => {
           initialId = text;
           cy.log('Initial ID:', initialId);
           cy.get('.w-50.my-3 > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
           .clear().type('174')
           cy.get('.admin-chat-feature-wrapper > :nth-child(1) > .ant-btn').click()
           cy.get('.btn-wrapper > :nth-child(3)').click()
           cy.get('.ant-message-notice-content')
           .contains('Access denied: User is not authorized to access this endpoint')
           cy.reload()
           cy.get('#rc-tabs-0-tab-11').click()
           // Perform other actions here
           // ...
           cy.get('.w-50.my-3 > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input')
           .invoke('val')
           .should('eq', initialId);
         });
       // should be deleted
         cy.contains('Limits').click()
         //cy.get('#rc-tabs-0-tab-2').click()
        //cy.get(':nth-child(2) > :nth-child(1) > .ant-btn').eq(0).click()
         cy.contains('Create Independent Limit').click()
         cy.get('#rc_select_3').click().type('{downarrow}')       // Simulates pressing the down arrow key once
         .type('{downarrow}')       // Simulates pressing the down arrow key again
         .type('{enter}'); 
       
         cy.get('#rc_select_4').click().type('{downarrow}')       // Simulates pressing the down arrow key once
         .type('{downarrow}')       // Simulates pressing the down arrow key again
         .type('{enter}'); 
         cy.get(':nth-child(3) > .ant-input').clear().type('3')
         cy.get(':nth-child(4) > .ant-input').clear().type('3')
         cy.contains('PROCEED').click()
         cy.get('.ant-message-notice-content')
         .contains('Access denied: User is not authorized to access this endpoint')
         cy.get('.ant-modal-body').contains('Back').click()
         //cy.get(':nth-child(2) > :nth-child(1) > .ant-btn').eq(1).click();
         cy.contains('Create Collective Limit').click()
         cy.get('#rc_select_5').click().type('{downarrow}')       // Simulates pressing the down arrow key once
         .type('{downarrow}')       // Simulates pressing the down arrow key again
         .type('{enter}'); 
       
         cy.get('#rc_select_6').click().type('{downarrow}')       // Simulates pressing the down arrow key once
         .type('{downarrow}')       // Simulates pressing the down arrow key again
         .type('{enter}'); 
       
         cy.get(':nth-child(4) > .ant-input').clear().type('3')
         cy.get(':nth-child(5) > .ant-input').clear().type('3')
       
         cy.contains('PROCEED').click()
         cy.get('.ant-message-notice-content')
         .contains('Access denied: User is not authorized to access this endpoint')
         cy.get('.ant-modal-body').contains('Back').click()
       
         cy.contains('Fee Markups').click()
         cy.get(':nth-child(1) > :nth-child(4) > .d-flex > .ant-btn').click()
         cy.get('.ant-input').last().clear().type('1')
         cy.contains('PROCEED').click()
          cy.get('.ant-message-notice-content')
         .contains('Access denied: User is not authorized to access this endpoint')
         cy.get('.ant-modal-close-x').click()
         
       
       cy.contains('Sessions').click()
       cy.get(':nth-child(2) > .d-flex > .ant-btn')
         .contains('1438')
         .first().then(($element) => {
           let initialDataRowKey = $element.closest('[data-row-key]').attr('data-row-key');
           cy.log(initialDataRowKey);
           cy.get(`[data-row-key="${initialDataRowKey}"] > :nth-child(6) > .d-flex > div`).contains('Active');
           cy.get(`[data-row-key="${initialDataRowKey}"] > :nth-child(6) > .d-flex > .ant-btn`).click()
           cy.wait(3000)
           cy.contains('Confirm').click()
           cy.get('.ant-message-notice-content').contains('Session revoked')
          
           cy.wait(5000)
           cy.get('.top-box-menu').click()
           cy.get('.notification-content-information')
           .contains('Your session is expired. Please login again.')
           cy.url().should('eq', 'https://sandbox.hollaex.com/login');
           //Session revoked
         });

   })




