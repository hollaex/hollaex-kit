/// <reference types="cypress" />

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const cucumber = require('cypress-cucumber-preprocessor').default
module.exports = (on, config) => {
  on('file:preprocessor', cucumber())

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}

// const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/

// Cypress.on('uncaught:exception', (err) => {
//   if (resizeObserverLoopErrRe.test(err.message)) {
//     // returning false here prevents Cypress from
//     // failing the test
//     return false
//   }
// })