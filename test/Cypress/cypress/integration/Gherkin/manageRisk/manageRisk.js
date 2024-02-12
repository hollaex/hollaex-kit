Given('I log in with the account {string}', (username) => {
  // Visiting the login page
  cy.visit(Cypress.env('LOGIN_PAGE'));
  // Checking if the login button is visible and disabled
  cy.get('.holla-button').should('be.visible').should('be.disabled');
  // Entering the email and password
  cy.get('[name="email"]').clear().type(username);
  cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'));
  // Clicking the login button and checking if no warning is present
  cy.get('.holla-button').should('be.visible').should('be.enabled').click();
  cy.get('.warning_text').should('not.exist'); 
});

When('I activate Risk Management', () => {
  // Navigating to Settings and then to Manage Risk
  cy.contains('Settings').click();
  cy.wait(5000); // Waiting for settings to load
  cy.contains('Manage Risk').click();
  // Turning on risk management if it's off
  cy.get('.option-text').each((element) => {
      cy.wrap(element).invoke('text').then((text) => {
          if (text.toLowerCase().includes('off')) {
              cy.wrap(element).click();
              cy.get('.holla-button').click();
          }
      });
  });
});

And('I choose a new percentage in the range of "1" to "101"', () => {
  // Extracting the current percentage
  cy.get('.table_body-row > :nth-child(1) > :nth-child(1)').invoke('text').then((text) => {
      const regex = /(\d+)%\(ADJUST PERCENTAGE\)/;
      const match = text.match(regex);
      if (match && match.length === 2) {
          let percentage = match[1];
          cy.log(percentage + "%");
          cy.wrap(percentage).as('percentage');
      } else {
          cy.error("Unable to extract percentage number from the text.");
      }
  });

  // Extracting the current value amount in USD Tether
  cy.get(':nth-child(2) > p').invoke('text').then((text) => {
      const regex = /Total assets value in USD Tether: (\d+)/;
      const match = text.match(regex);
      if (match && match.length === 2) {
          const amount = match[1];
          cy.log(amount);
          cy.wrap(amount).as('amount');
      } else {
          cy.error("Unable to extract value amount from the text.");
      }
  });

  // Setting new percentage and validating errors
  cy.get('.ml-2 > .edit-wrapper__container > :nth-child(1)').click(); 
  cy.get('@percentage').then((percentage) => {
      cy.get('.mt-1').contains(percentage + "%");
      cy.get('.input_field-input').clear().type('100');
      cy.get('.mt-3 > :nth-child(3)').click();
      cy.get('.warning_text').contains("Request validation failed: Parameter (data) failed schema validation");
      cy.get('.input_field-input').clear().type('101');
      cy.get('.mt-3 > :nth-child(3)').should('be.disabled');
      cy.get('.ReactModal__Content').click();
      cy.get('.field-error-content').contains("Value must be 100 or lower.");
  });

  // Generating a random number between 1 and 99
  const optedPercentage = Math.floor(Math.random() * 99) + 1;
  cy.wrap(optedPercentage).as('optedPercentage');
  cy.get('.input_field-input').clear().type(optedPercentage.toString());
  cy.get('.mt-3 > :nth-child(3)').click();  
  cy.get('@optedPercentage').then((optedPercentage) => {     
      cy.get('.table_body-row > :nth-child(1)').contains(optedPercentage);
      cy.get('@amount').then((amount) => { 
          const threshold = (optedPercentage * amount) / 100;
          cy.log("Threshold:", threshold);
          cy.wrap(threshold).as('threshold');
      });
  });
});

And('I make an open order size randomly bigger than the new percentage', () => {
  // Extracting and logging the current open order size
  cy.get('.table_body-row > :nth-child(2) > span').invoke('text').then((text) => {
      const floatNumber = parseFloat(text.replace(/[^\d.]/g, ''));
      cy.log(`Extracted Float Number: ${floatNumber}`);
    
      // Visiting the trading page and placing an order
      cy.visit('https://sandbox.hollaex.com/trade/xht-usdt');
      cy.get(':nth-child(5) > .trade_input-input-wrapper > input').clear().type(0.1);
      cy.get(':nth-child(6) > .trade_input-input-wrapper > input').clear().type((floatNumber * 10) + 0.1);
      cy.get('.holla-button').click();
  }); 
});

Then('I will get "Risky Trade Detected" message with the rate and the total amount', () => {
  // Checking for "Risky Trade Detected" notification
  cy.get('.notification-content-wrapper > :nth-child(4) > :nth-child(3)').click();
  cy.contains('Risky Trade Detected');
  cy.get('.risky-trade-wrapper > .d-flex > :nth-child(1)').click();
});

When('I deactivate Risk Management', () => {
  // Code to deactivate Risk Management
});

And('I make an open order size randomly bigger than the new percentage', () => {
  // Code to make an open order size randomly bigger than the new percentage
});

Then('I will get no "Risky Trade Detected" message', () => {
  // Code to ensure no "Risky Trade Detected" message is received
});

Then('I reset percentage to "90"% and activate Risk Management', () => {
  // Code to reset percentage to "90%" and activate Risk Management
});
