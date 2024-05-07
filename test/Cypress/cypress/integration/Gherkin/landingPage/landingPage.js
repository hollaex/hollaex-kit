import {Given, When, Then, And} from "cypress-cucumber-preprocessor/steps"
let arrangedElements = [];
let textsArray = [];
let elementPositions = [];
const elementsToArrange = [
  'Open-Source Crypto Exchange',
  'HollaEx/USD Tether',
  'Best prices' ,
  'Quick Trade',
  'Live Markets' ,];
const elementDescriptions = {
  'Best prices' : "Key icon features",
  'Open-Source Crypto Exchange' :"Title/heading",
  'HollaEx/USD Tether' : "Moving ticker cards",
  'Quick Trade' : "Quick trade calculator",
  'Live Markets' : "Market list", };

Given ('I am on the Hollaex landing page',()=>{
  cy.visit(Cypress.env('LANDING_PAGE'))
})

And ('I record all elements locations',()=>{
  // Get the position of each element
  cy.wrap(elementsToArrange).each((element) => { 
    cy.contains(element, { matchCase: false }).then(($el) => {
      $el[0].scrollIntoView();
      const position = $el.offset()
      cy.log(element,position)
      const { top } = position;
      elementPositions.push({ element: elementDescriptions[element] || element, top });
      });
    }).then(() => {
       // Sort elements by their top position
       elementPositions.sort((a, b) => a.top - b.top);
       cy.log(JSON.stringify(elementPositions))
       // Store the arranged elements in an array
        const arrangedElements = elementPositions.map((item) => item.element);
        // Log the arranged elements
        cy.log('Elements arranged from top to down:');
        arrangedElements.forEach((item) => {
         cy.log(item);
      });
    });
})

Then ('I should be able to click on the live market',()=>{
  cy.get('.pt-1').click()
  cy.contains('Markets',{ matchCase: false })
  cy.contains('LOGIN',{ matchCase: false })
})

And ('I login and check quick trade',()=>{
  cy.visit(Cypress.env('LANDING_PAGE'))
  cy.get('.quick_trade-section_wrapper > .holla-button').should('be.disabled')
  cy.get('[href="/login"] > .holla-button').click()
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
  cy.log('Please wait while the test is running')
  //cy.get('[style="position: fixed; right: 5px; top: calc((100vh - 160px) / 2); z-index: 1;"] > .edit-wrapper__icons-container > .edit-wrapper__icon-wrapper') .click()
  cy.get('*').filter((index, element) => {
    return Cypress.$(element).css('position') === 'fixed';
    }).then((fixedElements) => {
      // fixedElements now contains all elements with position: fixed
      // You can interact with these elements as needed
      // For example, clicking the first fixed element:
      if (fixedElements.length > 0) {
        cy.wrap(fixedElements[0]).click();
      }
    });
   
  cy.get('table.mt-4 > tbody > tr').then(($rows) => {
      const numRows = $rows.length;
      cy.log(numRows)
      for (let n = 1; n <= numRows; n++) {
        cy.get(`table.mt-4 > tbody > :nth-child(${n}) > :nth-child(2)`)
        .invoke('text')
        .then((text) => {
          cy.log(text);
          textsArray.push(n+'.'+text);
          cy.log((JSON.stringify(textsArray)))
    });
    cy.log((JSON.stringify(textsArray)))
      }
      
        // Select the last row of the 1st column
        const lastRow = cy.get(`table.mt-4 > tbody > :nth-child(${numRows}) > :nth-child(1)`);
          // Now you can perform actions with the last row element as needed
      });
   // Ensure both arrays have the same length
   expect(arrangedElements.length).to.equal(textsArray.length);

   // Loop through each element of arrangedElements and compare with textsArray
   arrangedElements.forEach((element, index) => {
     expect(element).to.equal(textsArray[index]);
   });
})

When ('I change the sequence',()=>{
  textsArray = []; 
  cy.get('table.mt-4 > tbody > :nth-child(1) > :nth-child(2)')
    .drag('table.mt-4 > tbody > :nth-child(3) > :nth-child(2)',{force: true})

    cy.contains('Confirm',{ matchCase: false }).click()
    cy.contains('PUBLISH',{ matchCase: false }).click()
    cy.get('.d-flex > .ml-1').click()
    cy.wait(5000)
    cy.contains('Enter edit mode').click()
    cy.get('*').filter((index, element) => {
      return Cypress.$(element).css('position') === 'fixed';
  }).then((fixedElements) => {
      // fixedElements now contains all elements with position: fixed
      if (fixedElements.length > 0) {
          // Create an alias for the first fixed element
          cy.wrap(fixedElements[0]).as('firstFixedElement').click();
      }
  });

    cy.get('table.mt-4 > tbody > tr').then(($rows) => {
      const numRows = $rows.length;
      cy.log(numRows)
      for (let n = 1; n <= numRows; n++) {
        cy.get(`table.mt-4 > tbody > :nth-child(${n}) > :nth-child(2)`)
        .invoke('text')
        .then((text) => {
          cy.log
          cy.log(text);
          textsArray.push(n+'.'+text);
          cy.log((JSON.stringify(textsArray)))
    });
    cy.log((JSON.stringify(textsArray)))
      }
      
        // Select the last row of the 1st column
        const lastRow = cy.get(`table.mt-4 > tbody > :nth-child(${numRows}) > :nth-child(1)`);
              // Now you can perform actions with the last row element as needed
      });

      cy.get('.action_notification-text > .anticon > svg').click()
})
Then ('Elements should be arranged',()=>{
  arrangedElements = []
  elementPositions= []
  // Get the position of each element
  cy.wrap(elementsToArrange).each((element) => { cy.contains(element, { matchCase: false }).then(($el) => {
    $el[0].scrollIntoView();
    const position = $el.offset()
    cy.log(element,position)
    const { top } = position;
    elementPositions.push({ element: elementDescriptions[element] || element, top });
    });
   }).then(() => {
     // Sort elements by their top position
     elementPositions.sort((a, b) => a.top - b.top);
     cy.log(JSON.stringify(elementPositions))
     // Store the arranged elements in an array
     const arrangedElements = elementPositions.map((item) => item.element);
      // Log the arranged elements
     cy.log('Elements arranged from top to down:');
     arrangedElements.forEach((item) => {
       cy.log(item);
    });
       // Ensure both arrays have the same length
   expect(arrangedElements.length).to.equal(textsArray.length);

   // Loop through each element of arrangedElements and compare with textsArray
   textsArray.forEach((element, index) => {
    // Remove numbering and period (e.g., "1.Market list" becomes "Market list")
    const cleanElement = element.substring(element.indexOf('.') + 1).trim();
    expect(cleanElement).to.equal(arrangedElements[index]);
  });
 
  });
    
})

