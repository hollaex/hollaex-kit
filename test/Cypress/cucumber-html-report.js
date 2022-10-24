//*** Let name it cucumber-html-report.js **
var os = require('os');
const { detect } = require('detect-browser');
const browser = detect();
const report = require("multiple-cucumber-html-reporter");
const cypress = require('cypress');
const fs = require("fs");
const { timeStamp } = require('console');
const dest = 'cypress/reports'+'dest'//timeStamp.toString()
fs.mkdir(dest)
fs.cp('cypress/cucuber-json',dest, { recursive: true })
report.generate(
    {jsonDir: "cypress/cucumber-json",  // ** Path of .json file **//
     reportPath: "./reports/cucumber-htmlreport.html",
      pageTitle: "Hollaex Kit Tests Report",
      reportName : "Test result",
      pageFooter : "Hollaex QA team",
      displayDuration: true,
      displayReportTime : true,
     metadata: {
        
     browser: {
        
        scenarioTimestamp : true,
        name: "chrome",
        version: browser.name+browser.version+browser.os
    },
    device: "Local test machine",
    platform: {name:  os.platform()+os.version,
        
    version: "11",env:'HollaexKit'}
         ,},
         customData: {
            title: 'Run info',
            data: [
                {label: 'Project', value: 'Hollaex Kit'},
                {label: 'Release', value: '2.4'},
                {label: 'Cycle', value: '1'},
                {label: 'Execution Time', value: Date()},
               
            ]
        }

        
        ,}
        
        
    );

    