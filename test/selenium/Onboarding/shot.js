
const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const path = require('path');
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('./../Utils/Utils.js');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

	//let step = util.getStep();
	util.logHolla(logPath)
let i=0;
let userName= "mahdi@testsae.com";
let passWord = "";


describe('shot', function() {
  this.timeout(300000)
  let driver
  let vars
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
    let reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
    console.log(reportPath)
     })
  afterEach(async function() {
    await driver.quit();
  })
  it('Untitled', async function() {
    console.log(" Test name: Untitled");
    console.log(" Step # | name | target | value");
    console.log(" 1 | open | /login | ");
    await driver.get("https://pro.hollaex.com/login")
    driver.manage().window().maximize();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++)
    await sleep(3000);

    console.log(" 2 | setWindowSize | maximize | ");
    driver.manage().window().maximize();;
    await sleep(3000);
    util.takeHollashot(driver,reportPath,i++)
    
    await sleep(3000);

    console.log(" 3 | type | name=email | username");
    await driver.findElement(By.name("email")).sendKeys(userName);
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 4 | type | name=password | password");
    await driver.findElement(By.name("password")).sendKeys(passWord);
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++)
    await sleep(3000);

    console.log(" 5 | click | css=.holla-button | ");
    await driver.findElement(By.css(".holla-button")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++)
    await sleep(3000);

    console.log(" 6 | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container | ");
    await driver.findElement(By.css(".app-menu-bar-content:nth-child(2) .edit-wrapper__container")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 7 | click | css=.app-menu-bar-content:nth-child(3) .edit-wrapper__container | ");
    await driver.findElement(By.css(".app-menu-bar-content:nth-child(3) .edit-wrapper__container")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 8 | click | css=.app-menu-bar-content:nth-child(4) .edit-wrapper__container | ");
    await driver.findElement(By.css(".app-menu-bar-content:nth-child(4) .edit-wrapper__container")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 9 | click | css=.d-flex:nth-child(3) > .side-bar-txt > .edit-wrapper__container | ");
    await driver.findElement(By.css(".d-flex:nth-child(3) > .side-bar-txt > .edit-wrapper__container")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 10 | click | css=.tab_item:nth-child(2) > div | ");
    await driver.findElement(By.css(".tab_item:nth-child(2) > div")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 11 | click | css=.tab_item:nth-child(3) > div | ");
    await driver.findElement(By.css(".tab_item:nth-child(3) > div")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 12 | click | css=.tab_item:nth-child(4) > div | ");
    await driver.findElement(By.css(".tab_item:nth-child(4) > div")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

    console.log(" 13 | click | css=.app_container-main | ");
    await driver.findElement(By.css(".app_container-main")).click();
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);
    await driver.executeScript("window.scrollBy(0,350)", "");
    await sleep(3000);
    await util.takeHollashot(driver,reportPath,i++);
    await sleep(3000);

  })
})
