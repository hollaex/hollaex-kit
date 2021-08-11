//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Console } = require('console');
const assert = require('assert');
const path = require('path');
const defNewUser = require('./newUser');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
let userName = defNewUser.getNewUser();
//userName= 'user1@testsae.com';
let passWord = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;
let website = process.env.WEBSITE;


if (process.env.NODE_ENV == 'test') {
	console.log('Variables are defined');
}
describe('Verification', function() {
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
	});

	afterEach(async function() {
		//await driver.quit();
	});

	it('Verify', async function() {
		var parent = driver.getWindowHandle();
		var windows = driver.getAllWindowHandles();
		//Given User's data
		console.log(' Test name	: NewUser');
		console.log(logInPage);
		await driver.get(logInPage);
		await driver.sleep(5000);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring', logInPage);
		console.log(' Step # | action | target | value');
    
		console.log(' 1 | type | name=email |', userName);
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
    
		console.log(' 2 | type | name=password | PASSWORD');
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
		//when login    
	    // Test name: a
		// Step # | name | target | value
		// 1 | open | /verification | 
		await sleep(5000);
		await driver.get(website+'verification');
		await sleep(5000);
		// 2 | click | css=.tab_item:nth-child(1) .custom_title-svg #Layer_1 | 
		await driver.findElement(By.css('.tab_item:nth-child(1) .custom_title-svg #Layer_1')).click();
		await sleep(5000);
		// 3 | click | css=.panel-information-row | 
		await driver.findElement(By.css('.panel-information-row')).click();
		await sleep(7000);
		//4 | assertText | css=.information-content | new user

		assert(await driver.findElement(By.css('.information-content')).getText() == userName.toLowerCase());
		//*[@id="root"]/div/div[2]/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[2]/div/div[1]/span/span
		// 5 | click | css=.verification-phone | 
		// await sleep(5000)
		// await driver.findElement(By.css(".verification-phone")).click()
		// await sleep(5000)
		// 6 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		// 7 | click | css=.d-flex > .holla-button | 
		await driver.findElement(By.css('.d-flex > .holla-button')).click();
		await sleep(5000);
		// 8 | click | css=.custom_title-img | 
		await driver.findElement(By.css('.custom_title-img')).click();
		await sleep(5000);
		// 9 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		// 10 | storeWindowHandle | root | 
		vars['root'] = await driver.getWindowHandle(windows[1]);
		// 11 | selectWindow | handle=${win1649} | 
		await driver.switchTo().window(parent);
		// 12 | assertTitle | iDenfy | 
		assert(await driver.getTitle() == 'iDenfy');
		// 13 | selectWindow | handle=${root} | 
		await driver.switchTo().window(vars['root']);

	});
});