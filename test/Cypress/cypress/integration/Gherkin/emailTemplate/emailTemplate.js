
    Given ('I am logged in as Admin',()=>{
      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
    })

    When ('I navigate to the customize emails section',()=>{
      cy.contains('Operator controls').click({force:true})
      cy.contains('General').click({force:true})
      cy.contains('Email').click({force:true})

    })
    And ('I select an email type of {string} to edit',(emailType)=>{
        cy.get(':nth-child(4) > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item')
        .click()
        cy.get('.option-wrapper > .ant-input').clear().type(emailType+"{enter}")
        cy.get('.email-option > .d-flex > :nth-child(1)').click()
        cy.wait(2000)

    })
    Then ('the email content and title should be displayed, and should be stored',()=>{
        cy.get('#EditEmailForm_format')
        .invoke('text')
        .then((text) => {
         cy.log(text);
        });
        cy.get('#EditEmailForm')
        .scrollIntoView()
        .find('#EditEmailForm_title')
        .invoke('val') 
        .then((text) => {
         cy.log(text);
        });
       
        cy.get('#EditEmailForm_format')
        .invoke('text')
        .then((text) => {
         cy.get('#EditEmailForm')
        .scrollIntoView()
        .find('#EditEmailForm_title')
        .invoke('val') 
        .then((titleText) => {
            
             cy.log(titleText)
              cy.writeFile('cypress/fixtures/loginEmailContent.json', { content: text, title: titleText });
            });
        });

        cy.fixture('loginEmailContent.json').then((expectedContent) => {
          
         cy.log(expectedContent.content)
         cy.get('#EditEmailForm_format').invoke('text').then((actualContent) => {
           if (actualContent !== expectedContent.content) {
             cy.fail(`Content does not match. Expected: ${expectedContent.content}. Actual: ${actualContent}.`);
           }
         })
       });

    })
    And ('I should be able to make changes to the email content and title',()=>{
        cy.get('#EditEmailForm_format').should('be.visible').should('not.be.enabled')
        cy.get('.d-flex > .anchor').contains('EDIT EMAIL').click()
        cy.get('#EditEmailForm_format').should('be.visible').should('be.enabled')
        cy.get(':nth-child(1) > .anchor').contains('CANCEL').click()
        cy.get('#EditEmailForm_format').should('be.visible').should('not.be.enabled')
        cy.get('.d-flex > .anchor').contains('EDIT EMAIL').click()

    })
    When ('I click on the save button',()=>{
       
          cy.get('#EditEmailForm_format').clear().type("test of body")
          cy.get('#EditEmailForm_title').clear().type("test of title")
         
  
          cy.get(':nth-child(10) > .ant-btn').click()
          
          cy.get(':nth-child(3) > .ant-input').invoke('text').then((actualContent) => {
             if (actualContent !== "test of body") {
               cy.fail(`Content does not match. Expected: "test of body". Actual: ${actualContent}.`);
             }
            
         });
        cy.get('.btn-wrapper > :nth-child(2)').click()
       
    })
    Then ('the changes should be saved',()=>{})
    And ('I should see a confirmation message',()=>{
        cy.get('.ant-message-notice-content').contains('Updated successfully')
    })
    And ('the email langs should be updated with my changes from {string} to {string}',(str1,str2)=>{
        cy.get(':nth-child(2) > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item')
        .click()
        .type('{downarrow}')
        .get('.ant-select-item-option-content')
        .each(($option, index, $options) => {
          const optionText = $option.text().trim()
          if (optionText === str1) {
            cy.wrap($option).click()
            return false // to exit each loop
          } else {
            cy.get(':nth-child(2) > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item')
              .type('{downarrow}')
          }
        })
 
        cy.get(':nth-child(2) > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item')
   .click()
   .type('{downarrow}')
   .get('.ant-select-item-option-content')
   .each(($option, index, $options) => {
     const optionText = $option.text().trim()
     if (optionText === str2) {
       cy.wrap($option).click()
       return false // to exit each loop
     } else {
       cy.get(':nth-child(2) > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item')
         .type('{downarrow}')
     }
   })
 
    })
	  

    Given ('I am on the login page',()=>{
        cy.visit(Cypress.env('LOGIN_PAGE'))
    })
    When ('I enter {string} as my email address',(email)=>{
               
        cy.get('.holla-button').should('be.visible').should('be.disabled')
        cy.get('[name="email"]').clear().type(email)
        cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
        cy.get('.holla-button').should('be.visible').should('be.enabled').click()
        cy.get('.warning_text').should('not.exist') 
    })
	Then ('I should be logged in as {string}',(email)=>{
        cy.url().should('contain','account')
        cy.get('#trade-nav-container > :nth-child(4) > :nth-child(2)')
        .should('contain',email)
    })

    Given ('I logged in my email',()=>{
        cy.visit(Cypress.env('EMAIL_PAGE'))
        cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'));
        cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'));
        cy.get('#wdc_login_button').click();
    })
	When ('I check my email inbox',()=>{
    // Open the latest email in the inbox
    cy.get('#ext-gen52').click();
    cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
      .dblclick();
    cy.wait(5000);
    })
    Then ('I should see the edited email in {string} inbox',(email)=>{
         // Verify the email content
         cy.fixture('loginEmailContent.json').then((expectedContent) => {
            cy.log(expectedContent.title)
            cy.get('.preview-title').contains("test of title")
         })
    ;
   
         cy.get('.giraffe-emailaddress-link').last().contains(email);
     
    
    cy.get('iframe').then(($iframe) => {
      const $emailBody = $iframe.contents().find('body');
      cy.wrap($emailBody).as('emailBody');
    });
    cy.get('@emailBody')
      .find('a')
      .should('exist');
    cy.get('@emailBody')
      .contains('test of body');
    
    })
    And ('the email content should match the changes I made',()=>{
      //cheking email
    })
  
    Then ('the email content and title should be restored to its original state',()=>{
        cy.get('.d-flex > .anchor').contains('EDIT EMAIL').click()

          cy.fixture('loginEmailContent.json').then((expectedContent) => {
            let text = expectedContent.content
          cy.get('#EditEmailForm_format').clear().type(text,{ parseSpecialCharSequences: false })
          cy.get('#EditEmailForm_title').clear().type(expectedContent.title)

          })
        
          cy.get(':nth-child(10) > .ant-btn').click()
          cy.fixture('loginEmailContent.json').then((expectedContent) => {
          cy.get(':nth-child(3) > .ant-input')
          .invoke('text').then((actualContent) => {
             if (actualContent !== expectedContent.content) {
               cy.fail(`Content does not match. Expected: ${expectedContent.content}. Actual: ${actualContent}.`);
             }
            })
         });
        cy.get('.btn-wrapper > :nth-child(2)').click()
       
         cy.get('.ant-message-notice-content').contains('Updated successfully')
    })






   
   

  
       
       
      
        
        
        


      
