//testing the logout function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
let userName = process.env.USER_NAME;
let passWord = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;
let signUpPage = process.env.SIGN_UP_PAGE;
let emailPage = process.env.EMAIL_PAGE;
if (process.env.NODE_ENV == 'test') {
	console.log('Variables are defined');
   }
describe('BobLogOut', function() {
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
	});
	afterEach(async function() {
		// await driver.quit();
	});
	it('Simple log in', async function() {
//Given The user logged in
		console.log(' Test name: BobLogIn');
		await driver.get(logInPage);
		await driver.sleep(5000);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring sand box');
		console.log(' Step # | action | target | value');
    
		console.log(' 1 | type | name=email |',userName);
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
    
		console.log(' 2 | type | name=password | Password');
		await driver.wait(until.elementLocated(By.name('password')), 5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
    
		console.log(' 3 | click | css=.auth_wrapper | ');
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.auth_wrapper'))), 5000);
		await driver.findElement(By.css('.auth_wrapper')).click();
		console.log(' 4 | verifyElementPresent | css=.holla-button |'); 
		{
			const elements = await driver.findElements(By.css('.holla-button'));
			expect(elements.length);
		}
    
		console.log(' 5 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
//when it is confirmed the user logged in		
		console.log(' 6 | assertText | css=.app-bar-account-content > div:nth-child(2) |',userName);
		await driver.wait(until.elementLocated(By.css('.app-bar-account-content > div:nth-child(2)')), 20000);
		await console.log(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText());
		expect(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText()).to.equal(userName);
//Then Log out should happen 		
		await console.log('7 | click | css=.align-items-center:nth-child(9) |');
		await driver.findElement(By.css('.align-items-center:nth-child(9)')).click();
		console.log('8 | assertText | css=.icon_title-text | Login');
		expect(await driver.findElement(By.css('.icon_title-text')).getText()).to.equal( 'Login');
   		console.log(' 9 | close |  | ');
		
 
	});
});
