import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"

Given ('Alice logged in successfully',()=>{}) 

And ('Alice has X amount of XHT',()=>{}) 

When ('Bob logged in successfully',()=>{

     cy.visit(Cypress.env('LOGIN_PAGE'))
     cy.get('.holla-button').should('be.visible').should('be.disabled')
     cy.get('[name="email"]').clear().type(Cypress.env('BOB'))
     cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'))
     cy.get('.holla-button').should('be.visible').should('be.enabled').click()
     cy.get('.warning_text').should('not.exist') 
     cy.get('#trade-nav-container > :nth-child(3) > :nth-child(2)')
     .should('contain',Cypress.env('BOB'))
})

And ('Bob transferred a minimal amount of XHT to Alice',()=>{

    cy.contains('Balance!').click({force:true})
    cy.contains('HollaEx').click({force:true})
    cy.get('[href="/wallet/xht/withdraw"] > .holla-button').as('send Crypto')
    .click({force:true})
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .field-content > .field-children > div > .input_field-input')
    .clear()
    .type('0x97b7b520e553794a610dc25d06414719ffb44a66')
    cy.get('.holla-button').click({force:true})
    cy.get('.review-crypto-amount > :nth-child(1)')
    .should('contain','0.0001 XHT')
    cy.get('.review-wrapper > .flex-column > :nth-child(4)')
    .should('contain','0x97b7b520e553794a610dc25d06414719ffb44a66')
    cy.get('.button-success').click({force:true})
    cy.get('.d-flex > .icon_title-wrapper > :nth-child(2) > .icon_title-text')
    //.should('contain','Confirm Via Email')
    cy.get('.d-flex > .holla-button').click({force:true})
    cy.wait(10000)
})

When ('Bob confirm the transfer by Email',()=>{

     cy.visit(Cypress.env('EMAIL_PAGE'))
     let link; 
     var text = null      
     cy.get('#wdc_username_div').type(Cypress.env('EMAIL_ADMIN_USERNAME'))
     cy.get('#wdc_password').type(Cypress.env('EMAIL_PASS'))
     cy.get('#wdc_login_button').click();
     cy.get('#ext-gen52').click()
     cy.log('created new user')
     cy.get('.x-grid3-row-first > .x-grid3-row-table > tbody[role="presentation"] > .x-grid3-row-body-tr > .x-grid3-body-cell > .x-grid3-row-body > .mail-body-row > tbody > tr > .subject > .grid_compact')
     .dblclick()
     cy.wait(5000)
     cy.then(()=>{
     text =  cy.getIframe('.preview-iframe').should('not.null').toString()})
     .then((text)=>  link= cy.trimmer(text,Cypress.env('EMAIL_WITHDREAW'),Cypress.env('BOB')))
     .should('not.be.false')
     .then((link )=>cy.forceVisit(link))
     cy.contains('Success').should('exist')
     cy.log("link is ", link )
}) 

Then ('Alice has received the minimal amount of XHT',()=>{}) 