import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('I am on the Hollaex landing page',()=>{
      cy.visit(Cypress.env('LANDING_PAGE'))
})

When ('All elements exist',()=>{
      cy.contains('Open-Source Crypto Exchange',{ matchCase: false })
      cy.contains('VIEW EXCHANGE',{ matchCase: false })
      cy.contains('START TRADING',{ matchCase: false })
      
      cy.contains('Markets',{ matchCase: false })
      cy.contains('LOGIN',{ matchCase: false })
      cy.contains('SIGN UP',{ matchCase: false })
      cy.contains('Quick Trade',{ matchCase: false })
      cy.get('.quick_trade-section_wrapper > .holla-button')

      cy.contains('LAST PRICE',{ matchCase: false })
      cy.contains('CHANGE',{ matchCase: false })
      cy.contains('24H HIGH',{ matchCase: false })
      cy.contains('24H LOW',{ matchCase: false })
      cy.contains('BEST BID',{ matchCase: false })
      cy.contains('BEST ASK',{ matchCase: false })
      cy.contains('24H VOLUME',{ matchCase: false })
})

Then ('I should be able to click on the live market',()=>{
    cy.get('.pt-1').click()
    cy.contains('Markets',{ matchCase: false })
    cy.contains('LOGIN',{ matchCase: false })
})

And ('I login check quick trade',()=>{
    cy.visit(Cypress.env('LANDING_PAGE'))
    cy.get('.quick_trade-section_wrapper > .holla-button').click()
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
    cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
    cy.wait(2000)
})

Then ('I visit the landing page in edit mode',()=>{
    cy.visit(Cypress.env('LANDING_PAGE'))
    cy.contains('Enter edit mode').click()
})

And ('I check the sequence of elements Title, Market list, and Quick trade calculator',()=>{
    cy.get('[style="position: fixed; right: 5px; top: calc((100vh - 160px) / 2); z-index: 1;"] > .edit-wrapper__icons-container > .edit-wrapper__icon-wrapper')
    .click()
    cy.get('.operator-controls__modal-title').contains('Sections')
    cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .contains('Title/heading',{ matchCase: false })
    cy.get('table.mt-4 > tbody > :nth-child(2) > :nth-child(2)')
    .contains('Card Section',{ matchCase: false })
    cy.get('table.mt-4 > tbody > :nth-child(3) > :nth-child(2)')
    .contains('Market list',{ matchCase: false })
    cy.get('table.mt-4 > tbody > :nth-child(4) > :nth-child(2)')
    .contains('Quick trade calculator',{ matchCase: false })
})

When ('I change the sequence',()=>{
    cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .drag('table.mt-4 > tbody > :nth-child(3) > :nth-child(2)',{force: true})
    cy.contains('Confirm',{ matchCase: false }).click()
    cy.contains('PUBLISH',{ matchCase: false }).click()
    cy.get('.d-flex > .ml-1').click()
    cy.wait(2000)
    cy.get('.mx-2 > :nth-child(3)')
    cy.contains('Open-Source Crypto Exchange',{ matchCase: false })
})
Then ('Elements should move',()=>{
    cy.contains('Enter edit mode').click()
    cy.get('[style="position: fixed; right: 5px; top: calc((100vh - 160px) / 2); z-index: 1;"] > .edit-wrapper__icons-container > .edit-wrapper__icon-wrapper')
    .click()
    cy.get('.operator-controls__modal-title').contains('Sections')
    cy.get('table.mt-4 > tbody > :nth-child(4) > :nth-child(2)')
    .contains('Title/heading',{ matchCase: false })
    cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .contains('Card section',{ matchCase: false })
    cy.get('table.mt-4 > tbody > :nth-child(2) > :nth-child(2)')
    .contains('Market list',{ matchCase: false })
   
    cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .drag('table.mt-4 > tbody > :nth-child(4) > :nth-child(2)',{force: true})
    cy.contains('Confirm',{ matchCase: false }).click()

    cy.wait(2000)
    cy.get('[style="position: fixed; right: 5px; top: calc((100vh - 160px) / 2); z-index: 1;"] > .edit-wrapper__icons-container > .edit-wrapper__icon-wrapper')
    .click()
    cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .drag('table.mt-4 > tbody > :nth-child(4) > :nth-child(2)',{force: true})
    cy.contains('Confirm',{ matchCase: false }).click()

    cy.wait(2000)
    cy.get('[style="position: fixed; right: 5px; top: calc((100vh - 160px) / 2); z-index: 1;"] > .edit-wrapper__icons-container > .edit-wrapper__icon-wrapper')
    .click()
    cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .drag('table.mt-4 > tbody > :nth-child(4) > :nth-child(2)',{force: true})
})

And ('I arrange elements in Market list, and Quick trade calculator',()=>{
    cy.contains('Confirm',{ matchCase: false }).click()
    cy.contains('PUBLISH',{ matchCase: false }).click()
    cy.get('.d-flex > .ml-1').click()
    cy.wait(2000)
    cy.get('.mx-2 > :nth-child(3)')
    cy.contains('Open-Source Crypto Exchange',{ matchCase: false })
})