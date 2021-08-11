//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const testContext = require ('./../onboarding/Newuser');
const { expect } = require('chai');
const { Console } = require('console');
const hollaTime = require('../trade/time');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
let userName = process.env.ADMIN_USER;
let passWord = process.env.ADMIN_PASS;
let logInPage = process.env.LOGIN_PAGE;
let website = process.env.WEBSITE;
let username = process.env.LEVEL_NAME;
let password = process.env.PASSWORD;
const timestamp = require('time-stamp');

function setPromotionRate(perc){
	

	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}
  
	localStorage.setItem('perc',perc);
	//console.log(localStorage.getItem('NewUser'));
	return localStorage.getItem('perc');
}

function getPromotionRate(){

	//console.log(newUser);

	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}

	return localStorage.getItem('perc');
}

describe('Trade', function() {
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
		await testContext.kitLogIn(driver, userName,passWord);
	
	});
	afterEach(async function() {
	 //await driver.quit();
	});
	it('promo', async function() {
	
		await driver.manage().window().maximize();
		// Test name: promo
		// Step # | name | target | value
		// 1 | open | https://website/account | 
		// await driver.get("https://website/account")
		// 2 | click | css=a > .pl-1 | 
		await driver.findElement(By.css('a > .pl-1')).click();
		await sleep(3000);
		// 3 | click | linkText=Users | 
		await driver.findElement(By.linkText('Users')).click();
		await sleep(3000);
		// 4 | type | name=input | leveltest@testsae.com
		await driver.findElement(By.name('input')).sendKeys('leveltest@testsae.com');
		await sleep(3000);
		// 5 | click | css=.ant-btn | 
		await driver.findElement(By.css('.ant-btn')).click();
		await sleep(3000);
		// 6 | click | css=.info-link:nth-child(2) | 
		await driver.findElement(By.css('.info-link:nth-child(2)')).click();
		await sleep(3000);
		// 7 | click | id=user-discount-form_feeDiscount | 
		await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
		await driver.findElement(By.id('user-discount-form_feeDiscount')).clear();
		// 8 | type | id=user-discount-form_feeDiscount | 13
		await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Math.floor(Math.random() * 100));
		// 9 | click | css=.w-100 | 
		await driver.findElement(By.css('.w-100')).click();
		await sleep(4000);
		// 10 | click | css=.mt-2 | 
		await driver.findElement(By.css('.mt-2')).click();


		await sleep(4000);
		// 11 | storeText | css=.mt-2 | perc
  
		vars['perc'] = await driver.findElement(By.css('.mt-2')).getText();
		hollaTime.Hollatimestampe();
		console.log('Timestamp : '+String(hollaTime.GetHollatimestampe()));
		setPromotionRate(vars['perc']);
		console.log(String(getPromotionRate()));
		// 12 | click | css=.ant-btn-primary:nth-child(2) > span | 
		await driver.findElement(By.css('.ant-btn-primary:nth-child(2) > span')).click();
		await sleep(4000);
		// 13 | click | css=.ant-message-notice-content | 
		// await driver.findElement(By.css(".ant-message-notice-content")).click()
		// 14 | click | css=.active-side-menu | 
		await driver.findElement(By.css('.active-side-menu')).click();
		await sleep(4000);
		// 15 | type | name=input | leveltest@testsae.com
		await driver.findElement(By.name('input')).sendKeys('leveltest@testsae.com');
		// 16 | click | css=.ant-btn | 
		await driver.findElement(By.css('.ant-btn')).click();
		await sleep(4000);
		// 17 | click | css=.info-link:nth-child(2) | 
		await driver.findElement(By.css('.info-link:nth-child(2)')).click();
		await sleep(4000);
		// 18 | click | id=user-discount-form_feeDiscount | 
		await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
		// 19 | storeValue | id=user-discount-form_feeDiscount | value
		vars['value'] = await driver.findElement(By.id('user-discount-form_feeDiscount')).getAttribute('value');
		// 20 | click | css=.ant-modal-close-x | 
		console.log(vars['value'] );
		await driver.findElement(By.css('.ant-modal-close-x')).click();
		// 21 | click | css=.top-box-menu:nth-child(1) | 
		await driver.findElement(By.css('.top-box-menu:nth-child(1)')).click();
		// 22 | click | css=.app-bar-account-content > div:nth-child(2) | 
		await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
		// 23 | click | css=.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3) | 
		await driver.findElement(By.css('.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3)')).click();
		// 24 | click | name=email | 
		//one day waiting 
		//await sleep(86400000)
		await driver.findElement(By.name('email')).click();
		// 25 | type | name=email | username
		await driver.findElement(By.name('email')).sendKeys(username);
		// 26 | type | name=password | password
		await driver.findElement(By.name('password')).sendKeys(password);
		// 27 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		// 28 | runScript | window.scrollTo(0,840) | 
		await driver.executeScript('window.scrollTo(0,840)');
		await sleep(4000);
		const diffInMilliseconds = Math.abs(new Date(timestamp('YYYY/MM/DD HH:mm:ss')) - new Date(hollaTime.GetHollatimestampe()));

		console.log(diffInMilliseconds); //86400000
		if (diffInMilliseconds >= 8.64e+7){
			console.log(diffInMilliseconds);
		}else {
			console.log('less than one day');
		}
		// 29 | click | css=.trade-account-secondary-txt > .d-flex > div:nth-child(2) | 
		await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).click();
		// 30 | assertText | css=.trade-account-secondary-txt > .d-flex > div:nth-child(2) | ${}
		// Fee reduction: 
		console.log(await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).getText());
		console.log(String(getPromotionRate()));
		assert(await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).getText() == String(getPromotionRate().replace('discount:','reduction:')));
 
	});
});
