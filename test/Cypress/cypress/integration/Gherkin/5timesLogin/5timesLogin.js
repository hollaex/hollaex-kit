Given('the user keys in the wrong password for the first time', () => {
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type("WrongPassword5?");
    cy.get('.grecaptcha-logo').should('exist');
    cy.wait(3000);
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('exist');
    cy.get('.warning_text').contains('Incorrect credentials.');
});

And('the user keys in the right password for the first time', () => {
    cy.wait(5000);
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'));
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('not.exist');
    cy.contains('Security').click();
    cy.contains('Login History').click();
    cy.get(':nth-child(2) > :nth-child(3) > :nth-child(1) > .px-1')
        .contains('Failed login: 1x');
    cy.contains("Signout").click();
});

And('the user keys in the wrong password for the second time', () => {
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type("WrongPassword5?");
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('exist');
    cy.get('.warning_text').contains('Incorrect credentials. You have 3 more attempts left');
});

And('the user keys in the right password for the second time', () => {
    cy.wait(5000);
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'));
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('not.exist');
    cy.contains('Security').click();
    cy.contains('Login History').click();
    cy.get(':nth-child(3) > :nth-child(3) > :nth-child(1) > .px-1')
        .contains('Failed login: 2x');
    cy.contains("Signout").click();
});

And('the user keys in the wrong password for the third time', () => {
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type("WrongPassword5?");
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('exist');
    cy.get('.warning_text').contains('Incorrect credentials. You have 3 more attempts left');
});

And('the user keys in the right password for the third time', () => {
    cy.wait(5000);
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.wait(5000);
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'));
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('not.exist');
    cy.contains('Security').click();
    cy.contains('Login History').click();
    cy.get(':nth-child(4) > :nth-child(3) > :nth-child(1) > .px-1')
        .contains('Failed login: 3x');
    cy.contains("Signout").click();
});

And('the user keys in the wrong password for the fourth time', () => {
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type("WrongPassword5?");
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('exist');
    cy.get('.warning_text').contains('Incorrect credentials. You have 1 more attempt left');
});

And('the user keys in the right password for the fourth time', () => {
    cy.wait(5000);
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'));
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('not.exist');
    cy.contains('Security').click();
    cy.contains('Login History').click();
    cy.get(':nth-child(5) > :nth-child(3) > :nth-child(1) > .px-1')
        .contains('Failed login: 4x');
    cy.contains("Signout").click();
});

When('the user keys in the wrong password for the fifth time', () => {
    cy.wait(5000);
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type("WrongPassword5?");
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
});

Then('the user should see the message {string}', (blockWarrning) => {
    cy.get('.warning_text').should('exist');
    cy.get('.warning_text').contains(blockWarrning);
});

When('the user attempts to log in with the wrong password after 1 minute', () => {
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type("WrongPassword5?");
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('exist');
});

And('the user should wait for 5 minutes', () => {
    cy.wait(300000); // Wait for 5 minutes
});

Then('the user keys in the right password and log in', () => {
    cy.visit(Cypress.env('LOGIN_PAGE'));
    cy.get('.holla-button').should('be.visible').should('be.disabled');
    cy.get('[name="email"]').clear().type("tester+5times@hollaex.email");
    cy.get('[name="password"]').clear().type(Cypress.env('PASSWORD'));
    cy.get('.holla-button').should('be.visible').should('be.enabled').click();
    cy.get('.warning_text').should('not.exist');
    cy.contains('Security').click();
    cy.contains('Login History').click();
    cy.get(':nth-child(6) > :nth-child(3) > :nth-child(1) > .px-1')
        .contains('Failed login: 5x');
});

