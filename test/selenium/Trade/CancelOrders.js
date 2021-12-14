//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function CancelOrders(){
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
	let step= util.getStep()

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
			
		});
		afterEach(async function() {
			util.setStep(step)
		//	await driver.quit();
		});
		it('Cancel Orders, all orders', async function() {
			await util.kitLogIn(step,driver, userName,passWord);
			console.log(step++,'  | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container |  | ');
			await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		    await sleep(5000)
			console.log(step++,'  | click | name=Search Assets |  | ');
			await driver.findElement(By.name('Search Assets')).click();
		
			console.log(step++,'  | type | name=Search Assets | xht | ');
			await driver.findElement(By.name('Search Assets')).sendKeys('xht-usdt');
		
			console.log(step++,'  | sendKeys | name=Search Assets | ${KEY_ENTER} | ');
			await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);

			console.log(step++,'  | click | css=.sticky-col > .d-flex > div:nth-child(2) |  |  ')
			await driver.findElement(By.css('.sticky-col > .d-flex > div:nth-child(2)')).click();
			await sleep(5000);
			
			// console.log(step++,'  | click | css=.trade_tab-pair-sub-title |  | ');
			// await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
			// await sleep(5000);

			console.log(step++,'  | click | css=.active-menu .edit-wrapper__container |  | ');
			await driver.findElement(By.css('.active-menu .edit-wrapper__container')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.tabs-pair-details:nth-child(1) > .market-card__sparkline-wrapper | ');
			await driver.findElement(By.css('.tabs-pair-details:nth-child(1) > .market-card__sparkline-wrapper')).click();
		    await sleep(5000);

			console.log(step++,'  | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		     await sleep(5000);
			 
			console.log(step++,' | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) .action_notification-text | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();
		
			console.log(step++,'  | click | css=.trade__active-orders_cancel-All .action_notification-text | ');
			await driver.findElement(By.css('.trade__active-orders_cancel-All .action_notification-text')).click();
		
			console.log(step++,'  | click | css=.icon_title-text | ');
			await driver.findElement(By.css('.icon_title-text')).click();
		
			console.log(step++,'  | assertText | css=.icon_title-text | Cancel Orders');
			assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Cancel Orders');
		
			console.log(step++,'  | click | css=.w-100 > .holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.w-100 > .holla-button:nth-child(3)')).click();
		
			console.log('This is the EndOfTest');
		});

	});
}
describe('Main Test', function () {
 
//	CancelOrders();
})
module.exports.CancelOrders = CancelOrders;