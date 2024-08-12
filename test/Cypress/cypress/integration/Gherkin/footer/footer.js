var website = 'https://www.hollaex.com/'
const randomTest= Math.random().toString(36).substring(2,6);
Given ('I log in the Hollaex',()=>{
 cy.visit(Cypress.env('LOGIN_PAGE'))
 cy.get('.holla-button').should('be.visible').should('be.disabled')
 cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
 cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
 cy.get('.holla-button').should('be.visible').should('be.enabled').click()
 cy.get('.warning_text').should('not.exist') 
}) 
When ('I change the  Exchange description',()=>{
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true})
 cy.get('.input_field > div > .ant-input').clear().type(randomTest)
 cy.get(':nth-child(3) > :nth-child(2) > div.w-100 > .ant-btn').click()
 cy.get('.ant-message-notice-content').contains('Updated successfully')
 }) 
Then ('Footer Exchange description should be changed',()=>{
 cy.get('.top-box-menu').click()
 cy.get('.footer-txt').contains(randomTest)
 }) 
When ('I change Footer small text',()=>{
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true})
 cy.get(':nth-child(7) > :nth-child(1) > :nth-child(2) > .d-flex > .ant-input').clear()
 .type(website+"term"+randomTest)
 cy.get(':nth-child(7) > :nth-child(2) > :nth-child(2) > .d-flex > .ant-input').clear()
 .type(website+"privacy"+randomTest+'{enter}')
 cy.wait(3000)
 cy.get('.ant-message-notice-content').contains('Updated successfully')
 cy.contains('Back to Website').click()
}) 
Then ('Footer small text should be changed',()=>{
  cy.contains('Terms of Service', { matchCase: false }).then($link => {
    const url = $link.prop('href');
    console.log('URL:', url);
    expect(url).to.include(website+"term"+randomTest); // Assert that the URL contains 
  });
 
  cy.get('.footer-row-bottom > .d-flex').contains('Privacy Policy',{matchCase:false})
   .then($link => {
   const url = $link.prop('href');
   console.log('URL:', url);
   expect(url).to.include(website+"privacy"+randomTest); // Assert that the URL contains 
  });

}) 

When ('I change Referral Badge',()=>{
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true})
 cy.get(':nth-child(11) > form > :nth-child(2) > :nth-child(2) > .d-flex > .ant-input')
 .clear().type('For white label exchange services - Visit HollaEx.com'+ randomTest)
 cy.get('form > :nth-child(3) > :nth-child(2) > .d-flex > .ant-input')
 .clear().type(website+randomTest)
 cy.get('.ant-checkbox-input')
 .should('not.be.checked');
 cy.get(':nth-child(4) > div.w-100 > .ant-btn').click()
 cy.get('.ant-message-notice-content').contains('Updated successfully')
}) 
Then ('Referral Badge should be changed',()=>{
 cy.contains('Back to Website').click()
 cy.get('.app_bar-icon').click()
 cy.get('.footer-row-bottom > :nth-child(1)')
 .contains('For white label exchange services - Visit HollaEx.com'+randomTest)
  .then($link => {
  const url = $link.prop('href');
  console.log('URL:', url);
  expect(url).to.include(website+randomTest); // Assert that the URL contains 
  });

}) 
When ('I add a column in Footer Links',()=>{
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true}) 
 cy.wait(4000)
 cy.get(':nth-child(1) > .input_field > label').last().then((header) => {
 cy.log(header.text())
 const str = header.text();
 const num = str.match(/\d+/)[0];
 cy.log("We already have " + num +" columns" ); 
   })
 cy.get('.center-content > .ant-btn').click()
 cy.get('.ant-modal-body > :nth-child(1) > form > .input_field > :nth-child(2) > .d-flex > .ant-input')
 .clear().type(randomTest)
 cy.get('.ant-modal-body > :nth-child(1) > form > :nth-child(2) > div.w-100 > .ant-btn').click()
 cy.get(':nth-child(4) > .admin-link > :nth-child(1)').last().click()
 cy.get('.ant-modal-body > :nth-child(1) > form > .input_field > :nth-child(2) > .d-flex > .ant-input')
 .clear().type(randomTest)
 cy.get('.ant-modal-body > :nth-child(1) > form > :nth-child(2) > div.w-100 > .ant-btn').click()
 cy.get(':nth-child(3) > .input_field > label').last().contains(randomTest)
 cy.get(':nth-child(3) > .input_field > :nth-child(2) > .d-flex > .ant-input').last()
 .clear().type(website+randomTest)
 cy.get(':nth-child(4) > .admin-link > :nth-child(1)').last().click()
 cy.get('.ant-modal-body > :nth-child(1) > form > .input_field > :nth-child(2) > .d-flex > .ant-input')
 .clear().type(randomTest)
 cy.get('.ant-modal-body > :nth-child(1) > form > :nth-child(2) > div.w-100 > .ant-btn').click()
 cy.get('.ant-message-custom-content').contains('Link already exist')
 cy.get('.ant-modal-close-x').click()
 cy.wait(3000)
 cy.get(':nth-child(2) > .ant-btn').click()
 cy.get('.ant-message-notice-content').contains('Updated successfully')
}) 
Then ('The column should be on the Footer page',()=>{
 cy.contains('Back to Website').click()
 cy.get('.app_bar-icon').click()
 cy.get('.footer-links-section--title').last().contains(randomTest)
 cy.get('.flex-column').last()
 .contains(randomTest)
 .then($link => {
  const url = $link.prop('href');
  console.log('URL:', url);
  expect(url).to.include(website+randomTest); // Assert that the URL contains 
  });

}) 
When ('I delete a column in Footer Links',()=>{
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true})
 cy.get(':nth-child(1) > .input_field > :nth-child(2) > .d-flex > .anticon > svg').last()
 .click()
 cy.get(':nth-child(2) > .ant-btn').click()
 cy.get('.ant-message-notice-content').contains('Updated successfully')
})  
Then ('The column should not be on the Footer page',()=>{
 cy.contains('Back to Website').click()
 cy.get('.app_bar-icon').click()
 cy.get('.footer-links-section--title')
 .last()
 .should('not.contain', randomTest);
 
}) 
When ('I hided referral badge',()=>{
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true})
 cy.get('.ant-checkbox-input')
 .should('not.be.checked').check()
 cy.get(':nth-child(4) > div.w-100 > .ant-btn').click()
 cy.get('.ant-message-notice-content').contains('Updated successfully')
}) 
Then ('Referral badge should be hidden',()=>{
 cy.contains('Back to Website').click()
 cy.get('.app_bar-icon').click()
 cy.get('.footer-row-bottom > :nth-child(1)')
 .should('not.contain', 'For white label exchange services - Visit HollaEx.com' + randomTest);
 cy.contains('Operator controls').click({force:true})
 cy.contains('General').click({force:true})
 cy.contains('Footer').click({force:true})
 cy.wait(3000)
 cy.get('.ant-checkbox-input')
 .should('be.checked')
 .uncheck();
 cy.get(':nth-child(4) > div.w-100 > .ant-btn').click()
 cy.get('.ant-message-notice-content').contains('Updated successfully')
}) 
