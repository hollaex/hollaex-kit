//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const defNewUser = require('./../Onboarding/newUser.js');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const dotenv = require('dotenv');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
dotenv.config();
//let bob = process.env.BOB;

let userName =  defNewUser.getNewUser();
let passWord = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;
let webSite = process.env.WEBSITE;
describe('LogIn', function() {
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
		console.log(' Test name: BobLogIn');
		await driver.get(logInPage);
		await driver.sleep(5000);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring sand box/your weibste');
		console.log(' Step # | action | target | value');
    
		console.log(' 1 | type | name=email |newuser@gmail.com');
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
    
		console.log(' 2 | type | name=password | password!');
		await driver.wait(until.elementLocated(By.name('password')), 5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
    
		console.log(' 3 | click | css=.auth_wrapper | ');
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.auth_wrapper'))), 5000);
		await driver.findElement(By.css('.auth_wrapper')).click();
		console.log(' 4 | verifyElementPresent | css=.holla-button |'); 
		{
			const elements = await driver.findElements(By.css('.holla-button'));
			// assert(elements.length);
			expect(elements.length);
		}
    
		console.log(' 5 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('ETH', async function() {
    
		console.log('opping the wallet');
		await driver.get(webSite+'wallet');
		await sleep(5000);
		await driver.findElement(By.name('search-assets')).click();
		console.log('6 | type | name=search-assets | USDT');
		await driver.findElement(By.name('search-assets')).sendKeys('USDT');
		console.log('7 | sendKeys | name=search-assets | ${KEY_ENTER}');
		await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		console.log('8 | click | css=.action-button-wrapper:nth-child(1) > .action_notification-text | ');
		await driver.findElement(By.css('.action-button-wrapper:nth-child(1) > .action_notification-text')).click();
		console.log('9 | click | css=.dropdown-placeholder | ');
		await driver.findElement(By.css('.dropdown-placeholder')).click();
		console.log('10 | click | id=network-eth-0 |'); 
		await driver.findElement(By.id('network-eth-0')).click();
		console.log(' 8 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 9 | click | css=.font-weight-bold | ');
		await driver.findElement(By.css('.font-weight-bold')).click();
		console.log(' 10 | assertText | css=.font-weight-bold > .edit-wrapper__container | Generate USD Tether Wallet');
		assert(await driver.findElement(By.css('.font-weight-bold > .edit-wrapper__container')).getText() == 'Generate USD Tether Wallet');
		console.log(' 11 | click | css=.holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
		await sleep(5000);
		console.log(' 12 | click | css=.dumb-field-wrapper .field-label-wrapper > .d-flex | ');
		await driver.findElement(By.css('.dumb-field-wrapper .field-label-wrapper > .d-flex')).click();
		await sleep(5000);
		console.log(' 13 | assertText | css=.dumb-field-wrapper .d-flex > .field-label | Your USD Tether receiving address');
		assert(await driver.findElement(By.css('.dumb-field-wrapper .d-flex > .field-label')).getText() == 'Your USD Tether receiving address');
	});
	it('TRX', async function() {

    
		await driver.get(webSite+'wallet');
		await sleep(5000);
		await driver.findElement(By.name('search-assets')).click();
		console.log(' 3 | type | name=search-assets | USDT');
		await driver.findElement(By.name('search-assets')).sendKeys('USDT');
		console.log(' 4 | sendKeys | name=search-assets | ${KEY_ENTER}');
		await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		console.log(' 5 | click | css=.action-button-wrapper:nth-child(1) > .action_notification-text | ');
		await driver.findElement(By.css('.action-button-wrapper:nth-child(1) > .action_notification-text')).click();
		console.log(' 6 | click | css=.dropdown-placeholder | ');
		await driver.findElement(By.css('.dropdown-placeholder')).click();
		console.log(' 7 | click | id=network-eth-0 | ');
		await driver.findElement(By.id('network-trx-1')).click();
		console.log(' 8 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 9 | click | css=.font-weight-bold | ');
		await driver.findElement(By.css('.font-weight-bold')).click();
		console.log(' 10 | assertText | css=.font-weight-bold > .edit-wrapper__container | Generate USD Tether Wallet');
		assert(await driver.findElement(By.css('.font-weight-bold > .edit-wrapper__container')).getText() == 'Generate USD Tether Wallet');
		console.log(' 11 | click | css=.holla-button:nth-child(3) | ');
		await sleep(5000);
		await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
		console.log(' 12 | click | css=.dumb-field-wrapper .field-label-wrapper > .d-flex | ');
		await sleep(5000);
		await driver.findElement(By.css('.dumb-field-wrapper .field-label-wrapper > .d-flex')).click();
		console.log(' 13 | assertText | css=.dumb-field-wrapper .d-flex > .field-label | Your USD Tether receiving address');
		assert(await driver.findElement(By.css('.dumb-field-wrapper .d-flex > .field-label')).getText() == 'Your USD Tether receiving address');
	});
});
