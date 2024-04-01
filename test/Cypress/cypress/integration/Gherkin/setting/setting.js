import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I logged in Hollaex',()=>{

    cy.visit(Cypress.env('LOGIN_PAGE'))
    cy.get('.holla-button').should('be.visible').should('be.disabled')
    cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
    cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
    cy.get('.holla-button').should('be.visible').should('be.enabled').click()
    cy.get('.warning_text').should('not.exist') 
    cy.wait(5000)
    cy.get('.ant-select-selection-item > .language_option').invoke('text').then((languageText) => {
      if (languageText === 'en') {
        // Perform desired actions if language is 'en'
        cy.log('Language is already set to English');
      } else {
        // Perform desired actions if language is not 'en'
        cy.log('You should select English language first');
        cy.log('Exiting the test...',languageText);
        cy.get('.language_option').click()
        cy.get('.ant-select-item-option-content > .language_option')
         .contains('en').click()
      
      }
    });
    
      cy.contains('Settings').click()
}) 

When ('I change language, it should change',()=>{

      cy.contains('Language').click()
      cy.get('.pr-4 > :nth-child(1) > .field-wrapper > :nth-child(1) > :nth-child(1) > .field-content > .field-children')
      .as('LangInput')
      .click()
      cy.get('#language-es-1').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','Preferencia de Idioma (Incluye correos electrònicos)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('es')
      
      cy.get('#language-de-2').click()
      cy.get('.holla-button').click()
      cy.contains('Spracheinstellungen (schließt E-Mails ein)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('de')
      
      cy.get('#language-it-3').click()
      cy.get('.holla-button').click()
      cy.contains('Preferenze lingua (include email)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('it')


      cy.get('#language-pt-4').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','Preferências de idioma (inclui e-mails)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('pt')

      cy.get('#language-tr-5').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','Dil seçenekleri (E-Postaları da kapsar)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('tr')

      cy.get('#language-ko-6').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','언어설정 (이메일수신포함)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('ko')
         
      cy.get('#language-fa-7').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label').should('contain','انتخاب زبان (این گزینه شامل ایمیل های ارسالی از طرف HollaEx نیز می شود)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('fa')
      
      cy.get(' #language-ar-8').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','تفضيلات اللغة (تشمل رسائل البريد الإلكتروني)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('ar')
      
      cy.get('#language-mn-9').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','Хэлний сонголт')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('mn')

      cy.get('#language-ur-10').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','زبان کی ترجیحات (بشمول ای میلز)')
      cy.get('@LangInput').click()
      cy.get('.language_option').contains('ur')
      
     
      cy.get('#language-en-0').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label').should('contain','Language preferences (Includes Emails)')
      cy.get('.language_option').contains('en')
             
  }) 

Then ('I did the test successfully',()=>{}) 