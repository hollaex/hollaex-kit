/// <reference types="cypress" />
const { lighthouse, pa11y, prepareAudit } = require("cypress-audit");
const cucumber = require('cypress-cucumber-preprocessor').default;
const { simpleParser } = require('mailparser');
const Imap = require('imap');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // Prepare for audits
  on("before:browser:launch", (browser = {}, launchOptions) => {prepareAudit(launchOptions); });

  // Register lighthouse and pa11y tasks
  // on("task", {
  //   lighthouse: lighthouse(), // calling the function is important
  //   pa11y: pa11y(), // calling the function is important
  // });

  // Setup for cucumber preprocessor
    on('file:preprocessor', cucumber());

  // Custom task for fetching the last email
  on('task', {
    getLastEmail: (emailConfig) => {
      return new Promise((resolve, reject) => {
        const imap = new Imap(emailConfig);

        function openInbox(cb) {
          imap.openBox('INBOX', true, cb);
        }

        imap.once('ready', () => {
          openInbox((err, box) => {
            if (err) {
              reject(err);
              return;
            }
            imap.search(['ALL'], (err, results) => {
              if (err) {
                reject(err);
                return;
              }
              if (results.length === 0) {
                resolve('No messages found.');
                imap.end();
                return;
              }
              const lastMessageSeqNo = results[results.length - 1];
              const f = imap.fetch(lastMessageSeqNo.toString(), { bodies: [''] });

              f.on('message', (msg) => {
                let emailBuffer = '';
                msg.on('body', (stream) => {
                  stream.on('data', (chunk) => {
                    emailBuffer += chunk.toString('utf8');
                  });
                });
                msg.once('end', () => {
                  simpleParser(emailBuffer, (err, mail) => {
                    if (err) {
                      reject('Parsing error: ' + err);
                    } else {
                      const result = `Email Body: ${mail.text || 'No plain text body'}\nHTML Body: ${mail.html || 'No HTML body'}`;
                      resolve(result);
                    }
                  });
                });
              });

              f.once('end', () => {
                imap.end();
              });
            });
          });
        });

        imap.once('error', (err) => {
          reject('IMAP error: ' + err);
        });

        imap.once('end', () => {
          console.log('Connection ended');
        });

        imap.connect();
      });
    }
  });
};
