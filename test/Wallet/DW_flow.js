//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
let bob = process.env.BOB;
let passWord = process.env.PASSWORD;
let alice = process.env.ALICE;
let logInPage = process.env.LOGIN_PAGE;

describe('Internal D/W Flow', function() {
	this.timeout(30000);
	let driver;
	let vars;
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	} 
	async function waitForWindow(timeout = 2) {
		await driver.sleep(timeout);
		const handlesThen = vars['windowHandles'];
		const handlesNow = await driver.getAllWindowHandles();
		if (handlesNow.length > handlesThen.length) {
			return handlesNow.find(handle => (!handlesThen.includes(handle)));
		}
		throw new Error('New window did not appear before timeout');
	}
	beforeEach(async function() {
		driver = await new Builder().forBrowser('chrome').build();
		vars = {};
	});
	afterEach(async function() {
		  // await driver.quit();
	});
	it('From Alice to Bob', async function() {
    
		console.log(' Test name: BobLogIn');
		await driver.get(logInPage);
		await driver.sleep(5000);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring sand box');
		console.log(' Step # | action | target | value');
    
		console.log(' 1 | type | name=email | alice@gmail.com');
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).sendKeys(alice);
    
		console.log(' 2 | type | name=password | Holla!');
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
   
		// 11 | click | css=.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container | 
		await driver.findElement(By.css('.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container')).click();
		// 12 | click | name=search-assets | 
		await driver.findElement(By.name('search-assets')).click();
		// 13 | type | name=search-assets | Hollaex
		await driver.findElement(By.name('search-assets')).sendKeys('Hollaex');
		// 14 | sendKeys | name=search-assets | ${KEY_ENTER}
		await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		// 15 | click | css=.csv-action:nth-child(2) > .action_notification-text | 
		await driver.findElement(By.css('.csv-action:nth-child(2) > .action_notification-text')).click();
		// 16 | click | name=address | 
		await driver.findElement(By.name('address')).click();
		// 17 | type | name=address | 0xef8a8e2053523fc989feb884f052726db5568ff6
		await driver.findElement(By.name('address')).sendKeys('0xef8a8e2053523fc989feb884f052726db5568ff6');
		// 18 | click | css=.with-notification .field-label-wrapper:nth-child(1) | 
		await driver.findElement(By.css('.with-notification .field-label-wrapper:nth-child(1)')).click();
		// 19 | click | name=amount | 
		await driver.findElement(By.name('amount')).click();
		// 20 | type | name=amount | 1
		await driver.findElement(By.name('amount')).sendKeys('1');
		// 21 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		// 22 | click | css=.button-fail | 
		await driver.findElement(By.css('.button-fail')).click();
		// 23 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		// 24 | click | css=.button-success | 
		await driver.findElement(By.css('.button-success')).click();
		await sleep(2000);
		// // 25 | click | css=.ReactModal__Content | 
		// await driver.findElement(By.css(".ReactModal__Content")).click()
		// 26 | assertText | css=.d-flex > .icon_title-wrapper .icon_title-text | Confirm Via Email
		assert(await driver.findElement(By.css('.d-flex > .icon_title-wrapper .icon_title-text')).getText() == 'Confirm Via Email');
		// 27 | click | css=.holla-button:nth-child(3) | 
    
		await driver.findElement(By.css('.holla-button:nth-child(3)')).click();
	});
  
	it('Gmailcheck', async function() {
		console.log('1 | open | /ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fh%2Fwcro9khk6y0j%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin |'); 
		await driver.get('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fh%2Fwcro9khk6y0j%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
    
		console.log('2 | setWindowSize | 1050x660 | ');
		await driver.manage().window().setRect(1050, 660);
    
		console.log('3 | type&Enter | id=identifierId | youremail@gmail.com');
		await driver.findElement(By.id('identifierId')).sendKeys(alice);
		await driver.findElement(By.id('identifierId')).sendKeys(Key.ENTER);
  
		console.log('4 | wait | name=password | Holla!');
		await driver.wait(until.elementsLocated(By.name('password'),30000,'wait', 5000));
		console.log('sleep well for 10');
		await sleep(5000);
    
		console.log('5 | type&Enter | id=password| your password!');
		await driver.findElement(By.name('password')).sendKeys('Holla!');
		await driver.findElement(By.name('password')).sendKeys(Key.ENTER);
    
		console.log('sleep well for 5');
		await sleep(5000);
    
		console.log('6 | click | linkText=Refresh | ');
		await driver.findElement(By.linkText('Refresh')).click();
		await driver.findElement(By.css('h3:nth-child(4) font')).click();
		// 4 | click | css=.ts > b | 
		await driver.findElement(By.css('.ts > b')).click();
		// 5 | click | css=td:nth-child(2) > table > tbody:nth-child(1) > tr > td:nth-child(2) | 
		await driver.findElement(By.css('td:nth-child(2) > table > tbody:nth-child(1) > tr > td:nth-child(2)')).click();
		// 6 | assertText | css=h2 b | sandbox XHT Withdrawal Request
		assert(await driver.findElement(By.css('h2 b')).getText() == 'sandbox XHT Withdrawal Request');
		// 7 | click | css=div:nth-child(4) button | 
		vars['windowHandles'] = await driver.getAllWindowHandles();
		// 8 | selectWindow | handle=${win4296} | 
		await driver.findElement(By.css('div:nth-child(4) button')).click();
		// 9 | click | css=.app-bar-account-content > div:nth-child(2) | 
		vars['win4296'] = await waitForWindow(2000);
		// 10 | click | css=.withdrawal-confirm-warpper | 
		await driver.switchTo().window(vars['win4296']);
		// 11 | click | css=.app-bar-account-content > div:nth-child(2) | 
		await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
		// 12 | click | css=.app-bar-account-menu-list:nth-child(11) > .edit-wrapper__container:nth-child(3) | 
		await driver.findElement(By.css('.withdrawal-confirm-warpper')).click();
		await driver.findElement(By.css('.icon_title-text')).click();
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success');
	});
	it('BobLogin', async function() {
		console.log(' Test name: BobLogIn');
		await driver.get(logInPage);
		await driver.sleep(5000);
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring sand box');
		console.log(' Step # | action | target | value');
    
		console.log(' 1 | type | name=email | bob@gmail.com');
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).sendKeys(bob);
    
		console.log(' 2 | type | name=password | Holla!');
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
		// 8 | click | css=.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container | 
		await driver.findElement(By.css('.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container')).click();
		// 9 | click | name=search-assets | 
		await driver.findElement(By.name('search-assets')).click();
		// 10 | type | name=search-assets | hollaex
		await driver.findElement(By.name('search-assets')).sendKeys('hollaex');
		// 11 | sendKeys | name=search-assets | ${KEY_ENTER}
		await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		// 12 | click | css=.td-amount > .d-flex | 
		await driver.findElement(By.css('.td-amount > .d-flex')).click();
		// 13 | assertText | css=.mr-4 | 1 XHT
		assert(await driver.findElement(By.css('.mr-4')).getText() == '1 XHT');
	});
});