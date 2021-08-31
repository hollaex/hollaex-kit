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
const util = require ('./../Utils/Utils.js');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
util.makeReportDir(reportPath);
util.makeReportDir(logPath);
require('console-stamp')(console, { 
	format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
} );
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
let userName = process.env.ADMIN_USER;
let passWord = process.env.ADMIN_PASS;
let logInPage = process.env.LOGIN_PAGE;
let website = process.env.WEBSITE;
let username = process.env.LEVEL_NAME;
let password = process.env.PASSWORD;
const timestamp = require('time-stamp');


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
		await driver.manage().window().maximize();
		await util.kitLogIn(driver, userName,passWord);
	
	});
	afterEach(async function() {
	 //await driver.quit();
	});

	it('Promotion', async function() {
	
		
		console.log(' Test name: promo ');
		console.log(' Step # | name | target | value');
		
		console.log(' 1 | open | https:console.log(website/account | ');
		console.log(' 2 | click | css=a > .pl-1 | ');
		await driver.findElement(By.css('a > .pl-1')).click();
		await sleep(3000);
		
		console.log(' 3 | click | linkText=Users | ');
		await driver.findElement(By.linkText('Users')).click();
		await sleep(3000);
		
		console.log(' 4 | type | name=input | leveltest@testsae.com');
		await driver.findElement(By.name('input')).sendKeys('leveltest@testsae.com');
		await sleep(3000);
		
		console.log(' 5 | click | css=.ant-btn | ');
		await driver.findElement(By.css('.ant-btn')).click();
		await sleep(3000);
		
		console.log(' 6 | click | css=.info-link:nth-child(2) | ');
		await driver.findElement(By.css('.info-link:nth-child(2)')).click();
		await sleep(3000);
		
		console.log(' 7 | click | id=user-discount-form_feeDiscount | ');
		await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
		await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Key.BACK_SPACE);
		await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Key.BACK_SPACE);
		await sleep(3000);

		console.log(' 8 | type | id=user-discount-form_feeDiscount | 13');
		await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Math.floor(Math.random() * 100));
		
		console.log(' 9 | click | css=.w-100 | ');
		await driver.findElement(By.css('.w-100')).click();
		await sleep(4000);
		
		console.log(' 10 | click | css=.mt-2 | ');
		await driver.findElement(By.css('.mt-2')).click();
		await sleep(4000);
		
		console.log(' 11 | storeText | css=.mt-2 | perc');
  		vars['perc'] = await driver.findElement(By.css('.mt-2')).getText();
		
		  util.Hollatimestamp();
		console.log('Timestamp : '+String(util.GetHollatimestamp()));
		util.setPromotionRate(vars['perc']);
		console.log(String(util.getPromotionRate()));
		
		console.log(' 12 | click | css=.ant-btn-primary:nth-child(2) > span | ');
		await driver.findElement(By.css('.ant-btn-primary:nth-child(2) > span')).click();
		await sleep(4000);
		
		console.log(' 13 | click | css=.ant-message-notice-content | ');
		// await driver.findElement(By.css(".ant-message-notice-content")).click()
		
		console.log(' 14 | click | css=.active-side-menu | ');
		await driver.findElement(By.css('.active-side-menu')).click();
		await sleep(4000);
		
		console.log(' 15 | type | name=input | leveltest@testsae.com');
		await driver.findElement(By.name('input')).sendKeys('leveltest@testsae.com');
		
		console.log(' 16 | click | css=.ant-btn | ');
		await driver.findElement(By.css('.ant-btn')).click();
		await sleep(4000);
		
		console.log(' 17 | click | css=.info-link:nth-child(2) | ');
		await driver.findElement(By.css('.info-link:nth-child(2)')).click();
		await sleep(4000);
		
		console.log(' 18 | click | id=user-discount-form_feeDiscount | ');
		await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
		
		console.log(' 19 | storeValue | id=user-discount-form_feeDiscount | value');
		vars['value'] = await driver.findElement(By.id('user-discount-form_feeDiscount')).getAttribute('value');
		
		console.log(' 20 | click | css=.ant-modal-close-x | ');
		console.log(vars['value'] );
		await driver.findElement(By.css('.ant-modal-close-x')).click();
		
		console.log(' 21 | click | css=.top-box-menu:nth-child(1) | ');
		await driver.findElement(By.css('.top-box-menu:nth-child(1)')).click();
		
		console.log(' 22 | click | css=.app-bar-account-content > div:nth-child(2) | ');
		await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
		
		console.log(' 23 | click | css=.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3) | ');
		await driver.findElement(By.css('.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3)')).click();
		
		console.log(' 24 | click | name=email | ');
		console.log('one day waiting ');
		//'await sleep(86400000)
		
		await driver.findElement(By.name('email')).click();
		console.log(' 25 | type | name=email | username');
		
		await driver.findElement(By.name('email')).sendKeys(username);
		console.log(' 26 | type | name=password | password');
		
		await driver.findElement(By.name('password')).sendKeys(password);
		console.log(' 27 | click | css=.holla-button | ');
		
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 28 | runScript | window.scrollTo(0,840) | ');
		
		await driver.executeScript('window.scrollTo(0,840)');
		await sleep(4000);
		const diffInMilliseconds = Math.abs(new Date(timestamp('YYYY/MM/DD HH:mm:ss')) - new Date(util.GetHollatimestamp()));

		console.log(diffInMilliseconds); //'86400000
		if (diffInMilliseconds >= 8.64e+7){
			console.log(diffInMilliseconds);
		}else {
			console.log('less than one day');
		}
		
		console.log(' 29 | click | css=.trade-account-secondary-txt > .d-flex > div:nth-child(2) | ');
		await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).click();
		
		console.log(' 30 | assertText | css=.trade-account-secondary-txt > .d-flex > div:nth-child(2) | ${}');
		console.log(' Fee reduction: ');
		console.log(await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).getText());
		console.log(String(util.getPromotionRate()));
		assert(await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).getText() == String(util.getPromotionRate().replace('discount:','reduction:')));
		
		console.log('This is the EndOfTest');
	});
});
