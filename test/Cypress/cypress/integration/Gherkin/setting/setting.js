import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

Given ('I logged in Hollaex',()=>{

      cy.visit(Cypress.env('LOGIN_PAGE'))
      cy.get('.holla-button').should('be.visible').should('be.disabled')
      cy.get('[name="email"]').clear().type(Cypress.env('ADMIN_USER'))
      cy.get('[name="password"]').clear().type(Cypress.env('ADMIN_PASS'))
      cy.get('.holla-button').should('be.visible').should('be.enabled').click()
      cy.get('.warning_text').should('not.exist') 
      cy.get('.app-menu-bar-side > :nth-child(7)').click()
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
      
      cy.get('#language-pt-2').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','Preferências de idioma (inclui e-mails)')
      cy.get('@LangInput').click()
      cy.get('#language-ru-3').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label').should('contain','Language preferences (Includes Emails)')
      cy.get('@LangInput').click()
      
      cy.get('#language-ko-4').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','언어설정 (이메일수신포함)')
      cy.get('@LangInput').click()
      
      cy.get('#language-ja-5').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','言語設定 (メールを含む)')
      cy.get('@LangInput').click()
      
      cy.get('#language-zh-6').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','语言设置（包括邮件）')
      cy.get('@LangInput').click()
      
      cy.get('#language-vi-7').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','Cài đặt ngôn ngữ (Bao gồm email)')
      cy.get('@LangInput').click()
      
      cy.get('#language-fa-8').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label').should('contain','انتخاب زبان (این گزینه شامل ایمیل های ارسالی از طرف HollaEx نیز می شود)')
      cy.get('@LangInput').click()
      
      cy.get(' #language-ar-9').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label')
      .should('contain','تفضيلات اللغة (تشمل رسائل البريد الإلكتروني)')
      cy.get('@LangInput').click()
      
      cy.get('#language-en-0').click()
      cy.get('.holla-button').click()
      cy.get('.d-flex > .field-label').should('contain','Language preferences (Includes Emails)')
             
  }) 

Then ('I did the test successfully',()=>{}) 