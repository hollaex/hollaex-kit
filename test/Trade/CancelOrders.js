//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
let userName = process.env.ADMIN_USER;
let passWord = process.env.ADMIN_PASS;
let logInPage = process.env.LOGIN_PAGE;
describe('Orders', function() {
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
		// Test name: Untitled
		// Step # | name | target | value
		// 1 | open | /account | 
		await driver.get(logInPage);
		await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
		// 4 | click | name=email | 
   
		await sleep(4000);
		await driver.findElement(By.name('email')).click();
		// 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('Cancel Orders, all orders', async function() {
		await sleep(4000);
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		// 5 | click | name=Search Assets |  | 
		await driver.findElement(By.name('Search Assets')).click();
		// 6 | type | name=Search Assets | xht | 
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		// 7 | sendKeys | name=Search Assets | ${KEY_ENTER} | 
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		// 8 | click | css=.trade_tab-pair-sub-title |  | 
		await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		// 9 | click | name=size |  | 
		await driver.manage().window().maximize();
		await sleep(5000);

		await driver.findElement(By.css('.active-menu .edit-wrapper__container')).click();
		// 3 | click | css=.tabs-pair-details:nth-child(1) > .market-card__sparkline-wrapper | 
		await driver.findElement(By.css('.tabs-pair-details:nth-child(1) > .market-card__sparkline-wrapper')).click();
		// 4 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 5 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 6 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 7 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 8 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 9 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 10 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		// 11 | click | css=.trade__active-orders_cancel-All .action_notification-text | 
		await driver.findElement(By.css('.trade__active-orders_cancel-All .action_notification-text')).click();
		// 12 | click | css=.icon_title-text | 
		await driver.findElement(By.css('.icon_title-text')).click();
		// 13 | assertText | css=.icon_title-text | Cancel Orders
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Cancel Orders');
		// 14 | click | css=.w-100 > .holla-button:nth-child(3) | 
		await driver.findElement(By.css('.w-100 > .holla-button:nth-child(3)')).click();
	});

});
