//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Console } = require('console');
const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
let userName = process.env.BOB;
let passWord = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;

if (process.env.NODE_ENV == 'test') {
	console.log('Variables are defined');
}
describe('reCAPTCHA', function() {
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

	it('ReCHAPTCHA log in', async function() {
		//Given User's data
		console.log(' Test name	: BobLogIn');
		console.log(logInPage);
		await driver.get(logInPage);
		await driver.sleep(10000);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring', logInPage);
		console.log(' Step # | action | target | value');
		await driver.switchTo().frame(0);
		// 3 | assertText | linkText=Privacy | Privacy
		assert(await driver.findElement(By.linkText("Privacy")).getText() == "Privacy");
		// 4 | assertElementPresent | xpath=(//a[contains(@href, 'https://www.google.com/intl/en/policies/terms/')])[2] | 
		{
			const elements = await driver.findElements(By.xpath("(//a[contains(@href, \'https://www.google.com/intl/en/policies/terms/\')])[2]"));
			assert(elements.length);
		}
		// 5 | assertElementNotPresent | css=.auth_form-wrapper > .w-100 | 
		{
			const elements = await driver.findElements(By.css(".auth_form-wrapper > .w-100"));
			assert(!elements.length);
		}
		// 6 | storeText | xpath=//strong[contains(.,'reCAPTCHA')] | txt
		vars["txt"] = await driver.findElement(By.xpath("//strong[contains(.,\'reCAPTCHA\')]")).getText();
		// 7 | echo | ${txt} | 
		console.log(vars["txt"]);
		await driver.switchTo().defaultContent();
		console.log(' 1 | type | name=email |', userName);
		await driver.findElement(By.name('email')).click();
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
		//when login    
		console.log(' 5 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		//then the username should be as same as entered 		
		console.log(' 6 | assertText | css=.app-bar-account-content > div:nth-child(2) |',userName);
		await driver.wait(until.elementLocated(By.css('.app-bar-account-content > div:nth-child(2)')), 20000);
		await console.log(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText());
		expect(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText()).to.equal(userName);
		 
		console.log(' 7 | close |  | ');
		
 
	});
});
