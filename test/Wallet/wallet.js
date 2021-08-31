//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
const path = require('path')
const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
const util = require ('../Utils/Utils.js');
util.makeReportDir(reportPath);
util.makeReportDir(logPath);
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
} );
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const fs = require('fs');
//let bob = process.env.BOB;

let userName =  util.getNewUser();
let passWord = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;
let webSite = process.env.WEBSITE;
describe('Wallet', function() {
	this.timeout(30000);
	let driver;
	let vars;
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	} 
	beforeEach(async function() {
		driver = await new Builder().forBrowser('chrome').build();
		vars = {};
		driver.manage().window().maximize();
		util.kitLogIn(driver,userName,passWord)
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('ETH', async function() {
    
		console.log(' 6 | open | wallet |');
		await driver.get(webSite+'wallet');
		await sleep(5000);

		console.log(' 7 | click | name=search-assets | ');
		await driver.findElement(By.name('search-assets')).click();
		
		console.log(' 8 | type | name=search-assets | USDT');
		await driver.findElement(By.name('search-assets')).sendKeys('USDT');
		
		console.log(' 9 | sendKeys | name=search-assets | ${KEY_ENTER}');
		await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
		console.log(' 10 | click | css=.action-button-wrapper:nth-child(1) > .action_notification-text | ');
		await driver.findElement(By.css('.action-button-wrapper:nth-child(1) > .action_notification-text')).click();
		
		console.log(' 11 | click | css=.dropdown-placeholder | ');
		await driver.findElement(By.css('.dropdown-placeholder')).click();
		
		console.log(' 12 | click | id=network-eth-0 |'); 
		await driver.findElement(By.id('network-eth-0')).click();
		
		console.log(' 13 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		
		console.log(' 14 | click | css=.font-weight-bold | ');
		await driver.findElement(By.css('.font-weight-bold')).click();
		
		console.log(' 15 | assertText | css=.font-weight-bold > .edit-wrapper__container | Generate USD Tether Wallet');
		assert(await driver.findElement(By.css('.font-weight-bold > .edit-wrapper__container')).getText() == 'Generate USD Tether Wallet');
		
		console.log(' 16 | click | css=.holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
		await sleep(5000);
		
		console.log(' 17 | click | css=.dumb-field-wrapper .field-label-wrapper > .d-flex | ');
		await driver.findElement(By.css('.dumb-field-wrapper .field-label-wrapper > .d-flex')).click();
		await sleep(5000);
		
		console.log(' 18 | assertText | css=.dumb-field-wrapper .d-flex > .field-label | Your USD Tether receiving address');
		assert(await driver.findElement(By.css('.dumb-field-wrapper .d-flex > .field-label')).getText() == 'Your USD Tether receiving address');
		
		console.log('This is the EndOfTest');
	});
	it('TRX', async function() {
		console.log(' 6 | open | wallet |');
		await driver.get(webSite+'wallet');
		await sleep(5000);
				
		console.log(' 7 | click | name=search-assets | ');
		await driver.findElement(By.name('search-assets')).click();
		
		console.log(' 8 | type | name=search-assets | USDT');
		await driver.findElement(By.name('search-assets')).sendKeys('USDT');
		
		console.log(' 9 | sendKeys | name=search-assets | ${KEY_ENTER}');
		await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
		console.log(' 10 | click | css=.action-button-wrapper:nth-child(1) > .action_notification-text | ');
		await driver.findElement(By.css('.action-button-wrapper:nth-child(1) > .action_notification-text')).click();
		
		console.log(' 11 | click | css=.dropdown-placeholder | ');
		await driver.findElement(By.css('.dropdown-placeholder')).click();
		
		console.log(' 12 | click | id=network-eth-0 | ');
		await driver.findElement(By.id('network-trx-1')).click();
		
		console.log(' 13 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		
		console.log(' 14 | click | css=.font-weight-bold | ');
		await driver.findElement(By.css('.font-weight-bold')).click();
		
		console.log(' 15 | assertText | css=.font-weight-bold > .edit-wrapper__container | Generate USD Tether Wallet');
		assert(await driver.findElement(By.css('.font-weight-bold > .edit-wrapper__container')).getText() == 'Generate USD Tether Wallet');
		await sleep(5000);

		console.log(' 16 | click | css=.holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
		await sleep(5000);

		console.log(' 17 | click | css=.dumb-field-wrapper .field-label-wrapper > .d-flex | ');
		await driver.findElement(By.css('.dumb-field-wrapper .field-label-wrapper > .d-flex')).click();
		
		console.log(' 18 | assertText | css=.dumb-field-wrapper .d-flex > .field-label | Your USD Tether receiving address');
		assert(await driver.findElement(By.css('.dumb-field-wrapper .d-flex > .field-label')).getText() == 'Your USD Tether receiving address');
	
		console.log('This is the EndOfTest');
	});
});
