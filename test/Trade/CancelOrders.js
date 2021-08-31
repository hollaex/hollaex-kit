//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
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
		driver.manage().window().maximize();
		util.kitLogIn(driver, userName,passWord);
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('Cancel Orders, all orders', async function() {
		console.log(' 7 | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container |  | ');
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		
		console.log(' 8 | click | name=Search Assets |  | ');
		await driver.findElement(By.name('Search Assets')).click();
		
		console.log(' 9 | type | name=Search Assets | xht | ');
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		
		console.log(' 10 | sendKeys | name=Search Assets | ${KEY_ENTER} | ');
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		
		console.log(' 11 | click | css=.trade_tab-pair-sub-title |  | ');
		await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		await sleep(5000);

		console.log(' 9 | click | css=.active-menu .edit-wrapper__container |  | ');
		await driver.findElement(By.css('.active-menu .edit-wrapper__container')).click();
		
		console.log(' 10 | click | css=.tabs-pair-details:nth-child(1) > .market-card__sparkline-wrapper | ');
		await driver.findElement(By.css('.tabs-pair-details:nth-child(1) > .market-card__sparkline-wrapper')).click();
		
		console.log(' 11 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 12 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 13 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 14 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 15 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 16 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 17 | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
		console.log(' 18 | click | css=.trade__active-orders_cancel-All .action_notification-text | ');
		await driver.findElement(By.css('.trade__active-orders_cancel-All .action_notification-text')).click();
		
		console.log(' 19 | click | css=.icon_title-text | ');
		await driver.findElement(By.css('.icon_title-text')).click();
		
		console.log(' 20 | assertText | css=.icon_title-text | Cancel Orders');
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Cancel Orders');
		
		console.log(' 21 | click | css=.w-100 > .holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.w-100 > .holla-button:nth-child(3)')).click();
		
		console.log('This is the EndOfTest');
	});

});
