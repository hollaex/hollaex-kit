var def = "HollaEx Open Exchange Platform"
const randomTest= Math.random().toString(36).substring(2,6);
 Given ('I log in the Hollaex',()=>{
    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type("tech@bitholla.com")
    cy.get('[name="password"]').clear().type("bitholla123")
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
 }) 
 When ('I change the  Exchange description',()=>{
    cy.contains('Operator controls').click({force:true})
    cy.contains('General').click({force:true})
    cy.contains('Footer').click({force:true})
    cy.get('.input_field > div > .ant-input').clear().type(randomTest)
    cy.get('.description-wrapper > :nth-child(3) > .ant-btn').click()
    cy.get('.ant-message-notice-content').contains('Updated successfully')
    cy.get('.top-box-menu').click()
    cy.get('.footer-txt').contains(randomTest)
 }) 

 Then ('Footer Exchange description should be changed',()=>{}) 

 When ('I change Footer small text',()=>{
    cy.contains('Operator controls').click({force:true})
    cy.contains('General').click({force:true})
    cy.contains('Footer').click({force:true})
    
    cy.get('.input_field > div > .ant-input').clear().type(def)
    cy.get('.description-wrapper > :nth-child(3) > .ant-btn').click()

    def = 'https://hollaex.com'
    cy.get(':nth-child(7) > :nth-child(1) > :nth-child(2) > .d-flex > .ant-input').clear()
    .type("https://www.google.com/search?q=term"+randomTest)
    cy.get(':nth-child(7) > :nth-child(2) > :nth-child(2) > .d-flex > .ant-input').clear()
    .type("https://www.google.com/search?q=privacy"+randomTest)
    cy.get('.description-wrapper > :nth-child(7) > .ant-btn').click()
    cy.get('.ant-message-notice-content').contains('Updated successfully')
    cy.get('.top-box-menu').click()
    
    cy.contains('Terms of Service',{matchCase:false})
    .invoke('removeAttr', 'target').click({force: true})
    
    cy.url().should('contain',"https://www.google.com/")
    cy.contains("term"+randomTest)
    cy.go('back')

    cy.contains('Privacy Policy',{matchCase:false})
    .invoke('removeAttr', 'target').click({force: true})
    cy.url().should('contain',"https://www.google.com/")
    cy.contains('privacy'+randomTest)
    cy.go('back')
 }) 

 Then ('Footer small text should be changed',()=>{}) 
 
 When ('I change Referral Badge',()=>{
   cy.get('.footer-row-bottom > :nth-child(1)').contains('Powered by HollaEx')
   cy.contains('Operator controls').click({force:true})
   cy.contains('General').click({force:true})
   cy.contains('Footer').click({force:true})
   cy.get('.check_field > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input')
   .should('not.be.checked').check()
   cy.get(':nth-child(11) > form > .ant-btn').click()
   cy.get('.ant-message-notice-content').contains('Updated successfully')
   cy.get('.top-box-menu').click()
   cy.contains('Powered by HollaEx').should('not.exist')
   cy.contains('Operator controls').click({force:true})
   cy.contains('General').click({force:true})
   cy.contains('Footer').click({force:true})
   cy.get('.check_field > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input')
   .should('be.checked').uncheck()
   cy.get(':nth-child(11) > form > .ant-btn').click()
   cy.get('.ant-message-notice-content').contains('Updated successfully')
 })  
 Then ('Referral Badge should be changed',()=>{}) 

 When ('I add a column in Footer Links',()=>{})  
 Then ('The column should be on the Footer page',()=>{}) 
 When ('I delete a column in Footer Links',()=>{})  
 Then ('The column should not be on the Footer page',()=>{}) 
 When ('I Add the link',()=>{}) 
 Then ('The footer link should work',()=>{}) 
