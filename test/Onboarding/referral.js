//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then

const scrap = require('./scraper');
const defNewUser = require('./newUser');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
let User = process.env.NEW_USER;
let passWord = process.env.PASSWORD;
let signUpPage = process.env.SIGN_UP_PAGE;
let emailAdmin =process.env.Email_ADMIN_USERNAME;
let logInPage = process.env.LOGIN_PAGE;
let userName = process.env.ADMIN_USER;
let apassWord = process.env.ADMIN_PASS;
let website = process.env.WEBSITE;
const newUser = defNewUser.defineNewUser(User,4) ;
console.log(newUser);

describe('NewUserRequest', function() {
	this.timeout(100000);
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
		await driver.quit();
   
	});
	it('CurrentUser', async function() {
		await driver.get(logInPage);
		await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(apassWord);
		// 4 | click | name=email | 
   
		await sleep(4000);
		await driver.findElement(By.name('email')).click();
		// 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
		await driver.manage().window().maximize();
		await sleep(4000);
		await driver.findElement(By.css('.trade-account-link:nth-child(2) > .pointer')).click();
		// 3 | click | css=.user_refer_info | 
		await sleep(4000);
		await driver.findElement(By.css('.user_refer_info')).click();
		// 4 | storeText | css=.user_refer_info > .edit-wrapper__container | currentNumber
		vars['currentNumber'] = await driver.findElement(By.css('.user_refer_info > .edit-wrapper__container')).getText();
		// 5 | pause | 5000 | 
		console.log(vars['currentNumber']);
	    // 2 | click | css=.mr-5 | 
		await driver.findElement(By.css('.mr-5')).click();
		// 4 | click | css=.app-bar-account-content > div:nth-child(2) | 
		await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
		// 5 | click | css=.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3) | 
		await driver.findElement(By.css('.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3)')).click();
	  
	    console.log(' 9 | close |  | ');
		console.log('Test name: NewUserRequest');
		console.log(' Step # | name | target | value');
		console.log('1 | open | ',signUpPage);
		await driver.get(signUpPage);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring sand box');
		console.log(' Step # | action | target | value');
		console.log('2 | setWindowSize | 1050x660 | ');
		await driver.manage().window().setRect(1050, 660);
     
		console.log('3 | type | name=email |',newUser);
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).clear();
		await driver.findElement(By.name('email')).sendKeys(newUser);
     
		console.log('4 | type | name=password | password!');
		await driver.findElement(By.name('password')).clear();
		await driver.findElement(By.name('password')).sendKeys(passWord);
      
      
		console.log('5 | type | name=password_repeat | your password again!');
		await driver.findElement(By.name('password_repeat')).clear();
		await driver.findElement(By.name('password_repeat')).sendKeys(passWord);
		await sleep(2000);
		await driver.findElement(By.name('referral')).clear();
		//https://sandbox.hollaex.com/signup?affiliation_code=KLUTI0
		await driver.findElement(By.name('referral')).sendKeys('KLUTI0');
		console.log('6 | click | name=terms |'); 
		await driver.findElement(By.name('terms')).click();
		await sleep(10000);
		console.log('7 | click | css=.holla-button |'); 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
		await driver.executeScript('window.scrollTo(0,0)');
		await sleep(5000);
		console.log('Clicked');
  
		// there is no need for verification
		//	defNewUser.adminVerifiesNewUser(driver,userName,apassWord,newUser)
	
		// await driver.get(logInPage);
		// await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(apassWord);
		// 4 | click | name=email | 
   
		await sleep(4000);
		await driver.findElement(By.name('email')).click();
		// 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
		await driver.manage().window().maximize();
		await sleep(4000);
		await driver.findElement(By.css('.trade-account-link:nth-child(2) > .pointer')).click();
		// 3 | click | css=.user_refer_info | 
		await sleep(4000);
		await driver.findElement(By.css('.user_refer_info')).click();
		// 4 | storeText | css=.user_refer_info > .edit-wrapper__container | currentNumber
		vars['newNumber'] = await driver.findElement(By.css('.user_refer_info > .edit-wrapper__container')).getText();
		// 5 | pause | 5000 | 
		console.log(vars['newNumber']);
		expect(vars['newNumber']).to.not.equal(vars['currentNumber']);
		console.log(vars['currentNumber']+' became '+vars['newNumber']);
	});
});