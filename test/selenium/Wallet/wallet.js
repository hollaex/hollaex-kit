//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function Wallet(){
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
	let step = util.getStep()
	describe('Wallet', function() {
		this.timeout(300000);
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
			let step = util.getStep()
			await util.kitLogIn(step,driver,userName.toLowerCase(),passWord)
		});
		afterEach(async function() {
			util.setStep(step);
			// await driver.quit();
		});
		it('ETH', async function() {
    
			console.log(step++,' | open | wallet |');
			await driver.get(webSite+'wallet');
			await sleep(5000);

			console.log(step++,' | click | name=search-assets | ');
			await driver.findElement(By.name('search-assets')).click();
			await sleep(3000);

			console.log(step++,' | type | name=search-assets | USDT');
			await driver.findElement(By.name('search-assets')).sendKeys('USDT');
			await sleep(3000);

			console.log(step++,' | sendKeys | name=search-assets | ${KEY_ENTER}');
			await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
			console.log(step++,' | click | css=.action-button-wrapper:nth-child(1) > .action_notification-text | ');
			await driver.findElement(By.css('.action-button-wrapper:nth-child(1) > .action_notification-text')).click();
		    await sleep(3000);

			console.log(step++,' | click | css=.dropdown-placeholder | ');
			await driver.findElement(By.css('.dropdown-placeholder')).click();
			await sleep(3000);
			
			console.log(step++,' | click | id=network-eth-0 |'); 
			await driver.findElement(By.id('network-eth-0')).click();
		
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
		
			console.log(step++,' | click | css=.font-weight-bold | ');
			await driver.findElement(By.css('.font-weight-bold')).click();
		
			console.log(step++,' | assertText | css=.font-weight-bold > .edit-wrapper__container | Generate USD Tether Wallet');
			assert(await driver.findElement(By.css('.font-weight-bold > .edit-wrapper__container')).getText() == 'Generate USD Tether Wallet');
		
			console.log(step++,' | click | css=.holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
			await sleep(5000);
		
			console.log(step++,' | click | css=.dumb-field-wrapper .field-label-wrapper > .d-flex | ');
			await driver.findElement(By.css('.dumb-field-wrapper .field-label-wrapper > .d-flex')).click();
			await sleep(5000);
		
			console.log(step++,' | assertText | css=.dumb-field-wrapper .d-flex > .field-label | Your USD Tether receiving address');
			assert(await driver.findElement(By.css('.dumb-field-wrapper .d-flex > .field-label')).getText() == 'Your USD Tether receiving address');
		
			console.log('This is the EndOfTest');
		});
		it('TRX', async function() {
			console.log(step++,' | open | wallet |');
			await driver.get(webSite+'wallet');
			await sleep(5000);
				
			console.log(step++,' | click | name=search-assets | ');
			await driver.findElement(By.name('search-assets')).click();
		
			console.log(step++,' | type | name=search-assets | USDT');
			await driver.findElement(By.name('search-assets')).sendKeys('USDT');
		
			console.log(step++,' | sendKeys | name=search-assets | ${KEY_ENTER}');
			await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
			console.log(step++,' | click | css=.action-button-wrapper:nth-child(1) > .action_notification-text | ');
			await driver.findElement(By.css('.action-button-wrapper:nth-child(1) > .action_notification-text')).click();
		
			console.log(step++,' | click | css=.dropdown-placeholder | ');
			await driver.findElement(By.css('.dropdown-placeholder')).click();
		
			console.log(step++,' | ');
			await driver.findElement(By.id('network-trx-1')).click();
		
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
		
			console.log(step++,' | click | css=.font-weight-bold | ');
			await driver.findElement(By.css('.font-weight-bold')).click();
		
			console.log(step++,' | assertText | css=.font-weight-bold > .edit-wrapper__container | Generate USD Tether Wallet');
			assert(await driver.findElement(By.css('.font-weight-bold > .edit-wrapper__container')).getText() == 'Generate USD Tether Wallet');
			await sleep(5000);

			console.log(step++,' | click | css=.holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
			await sleep(5000);

			console.log(step++,' | click | css=.dumb-field-wrapper .field-label-wrapper > .d-flex | ');
			await driver.findElement(By.css('.dumb-field-wrapper .field-label-wrapper > .d-flex')).click();
		
			console.log(step++,' | assertText | css=.dumb-field-wrapper .d-flex > .field-label | Your USD Tether receiving address');
			assert(await driver.findElement(By.css('.dumb-field-wrapper .d-flex > .field-label')).getText() == 'Your USD Tether receiving address');
	
			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	//Wallet();
})
module.exports.Wallet = Wallet ;