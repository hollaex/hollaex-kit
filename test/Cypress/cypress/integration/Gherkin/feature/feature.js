
    Given ('I log in the Hollaex',()=>{

        cy.visit(Cypress.env('LOGIN_PAGE'))
        cy.get('.holla-button').should('be.visible').should('be.disabled')
        cy.get('[name="email"]').clear().type("tech@bitholla.com")
        cy.get('[name="password"]').clear().type("bitholla123")
        cy.get('.holla-button').should('be.visible').should('be.enabled').click()
        cy.get('.warning_text').should('not.exist') 
         
    })

    When ('I check all features',()=>{}) 

    And ('I should be able to enable or disable Pro trade',()=>{
        cy.contains('Pro trade').should('exist')
        cy.contains('Operator controls').click({force:true})
        cy.contains('General').click({force:true})
  
   
         cy.contains('Features').click({force:true})
         cy.get('#interface-form_pro_trade')
         .should('be.checked').should('be.checked').uncheck()
         cy.get('#interface-form > :nth-child(2) > .ant-btn')
         .click()
         cy.get('.ant-message-notice-content').contains('Updated successfully')
         cy.get('.top-box-menu').click()
         cy.contains('Pro trade').should('not.exist')
  
         cy.contains('Operator controls').click({force:true})
         cy.contains('General').click({force:true})
  
   
         cy.contains('Features').click({force:true})
         cy.get('#interface-form_pro_trade')
         .should('not.be.checked').check()
         cy.get('#interface-form > :nth-child(2) > .ant-btn')
         .click()
         cy.get('.ant-message-notice-content').contains('Updated successfully')
         cy.get('.top-box-menu').click()
       
    })

    And ('I should be able to enable or disable Quick trade',()=>{
        cy.contains('Quick trade').should('exist')
        cy.contains('Operator controls').click({force:true})
        cy.contains('General').click({force:true})
   
        cy.contains('Features').click({force:true})
        cy.get('#interface-form_quick_trade')
        .should('be.checked').should('be.checked').uncheck()
        cy.get('#interface-form > :nth-child(2) > .ant-btn')
        .click()
        cy.get('.ant-message-notice-content').contains('Updated successfully')
        cy.get('.top-box-menu').click()
        cy.contains('Quick trade').should('not.exist')
 
        cy.contains('Operator controls').click({force:true})
        cy.contains('General').click({force:true})
   
        cy.contains('Features').click({force:true})
        cy.get('#interface-form_quick_trade')
        .should('not.be.checked').check()
        cy.get('#interface-form > :nth-child(2) > .ant-btn')
        .click()
        cy.get('.ant-message-notice-content').contains('Updated successfully')
        cy.get('.top-box-menu').click()

    })
    And ('I should be able to enable or disable Staking',()=>{
        cy.contains('Stake').should('exist')
        cy.contains('Operator controls').click({force:true})
        cy.contains('General').click({force:true})
   
        cy.contains('Features').click({force:true})
        cy.get('#interface-form_stake_page')
        .should('be.checked').should('be.checked').uncheck()
        cy.get('#interface-form > :nth-child(2) > .ant-btn')
        .click()
        cy.get('.ant-message-notice-content').contains('Updated successfully')
        cy.get('.top-box-menu').click()
        cy.contains('Stake').should('not.exist')
 
        cy.contains('Operator controls').click({force:true})
        cy.contains('General').click({force:true})
   
        cy.contains('Features').click({force:true})
        cy.get('#interface-form_stake_page')
        .should('not.be.checked').check()
        cy.get('#interface-form > :nth-child(2) > .ant-btn')
        .click()
        cy.get('.ant-message-notice-content').contains('Updated successfully')
        cy.get('.top-box-menu').click()

    })

    And ('I should be able to enable or disable Chat system',()=>{
        cy.get('.chat-header-txt').should('exist')
       cy.contains('Operator controls').click({force:true})
       cy.contains('General').click({force:true})

 
       cy.contains('Features').click({force:true})
       cy.get('#interface-form_chat')
       .should('be.checked').should('be.checked').uncheck()
       cy.get('#interface-form > :nth-child(2) > .ant-btn')
       .click()
       cy.get('.ant-message-notice-content').contains('Updated successfully')
       cy.get('.top-box-menu').click()
       cy.get('.chat-header-txt').should('not.exist')

       cy.contains('Operator controls').click({force:true})
       cy.contains('General').click({force:true})

 
       cy.contains('Features').click({force:true})
       cy.get('#interface-form_chat')
       .should('not.be.checked').check()
       cy.get('#interface-form > :nth-child(2) > .ant-btn')
       .click()
       cy.get('.ant-message-notice-content').contains('Updated successfully')
       cy.get('.top-box-menu').click()
    })
    And ('I should be able to enable or disabl Homepage',()=>{
        cy.contains('Operator controls').click({force:true})
       cy.contains('General').click({force:true})

 
       cy.contains('Features').click({force:true})
       cy.get('#interface-form_home_page')
       .should('be.checked').should('be.checked').uncheck()
       cy.get('#interface-form > :nth-child(2) > .ant-btn')
       .click()
       cy.get('.ant-message-notice-content').contains('Updated successfully')
       cy.visit("https://sandbox.hollaex.com")
       cy.url().should('include', '/account')

       cy.contains('Operator controls').click({force:true})
       cy.contains('General').click({force:true})

 
       cy.contains('Features').click({force:true})
       cy.get('#interface-form_home_page')
       .should('not.be.checked').check()
       cy.get('#interface-form > :nth-child(2) > .ant-btn')
       .click()
       cy.get('.ant-message-notice-content').contains('Updated successfully')
       cy.visit("https://sandbox.hollaex.com")
       cy.url().should('eq','https://sandbox.hollaex.com/')

    })
    Then ('I should be able to disable Chat system',()=>{})