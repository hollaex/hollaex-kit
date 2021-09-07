// supervisor
async function Supervisor(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const path = require('path');
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('../Utils/Utils.js');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	const { Supervisor } = require('../Dev/Modules.js');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, './../.env') });
	let supervisor = process.env.SUPERVISOR;
	let password = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;

	describe('supervisor', function() {
		this.timeout(3000000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}
		beforeEach(async function() {
			driver = await new Builder().forBrowser('chrome').build();
			driver.manage().window().maximize();
			vars = {};
		});
		afterEach(async function() {
			await driver.quit();
		});
		it('supervisor', async function() {
			console.log('Supervisor can access all deposit, withdrawals and approval settings');
			console.log(' Test name: Supervisor');
			console.log(' Step # | name | target | value');
		
			console.log(' 1 | open | /login | ');
			await driver.get(logInPage);
			await sleep(5000);
		
			console.log(' 2 | type | name=email |'+supervisor);
			await driver.findElement(By.name('email')).sendKeys(supervisor);
		
			console.log(' 3 | type | name=password | password');
			await driver.findElement(By.name('password')).sendKeys(password);
		
			console.log(' 4 | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log(' 5 | click | css=a > .pl-1 | ');
			await sleep(5000);
			await driver.findElement(By.css('a > .pl-1')).click();
		
			console.log(' 6 | click | linkText=Users | ');
			await driver.findElement(By.linkText('Users')).click();
			await sleep(5000);

			console.log(' 7 | click | name=id | ');
			await driver.findElement(By.name('id')).click();

			console.log(' 8 | type | name=id | 1');
			await driver.findElement(By.name('id')).sendKeys('1');
		
			console.log(' 9 | sendKeys | name=id | ${KEY_ENTER}');
			await driver.findElement(By.name('id')).sendKeys(Key.ENTER);
		
			console.log(' 10 | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
			await sleep(5000);

			console.log(' 11 | click | id=rc-tabs-1-tab-balance | ');
			await driver.findElement(By.id('rc-tabs-1-tab-balance')).click();
			await sleep(5000);

			console.log(' 12 | click | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			await driver.findElement(By.css('.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)')).click();
			await sleep(5000);
		
			console.log(' 13 | assertElementPresent | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) |'); 
			{
				const elements = await driver.findElements(By.css('.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}
		
			console.log(' 14 | assertElementPresent | css=.ant-table-row:nth-child(2) > .ant-table-cell:nth-child(5) | ');
			{
				const elements = await driver.findElements(By.css('.ant-table-row:nth-child(2) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}
		
			console.log(' 15 | click | id=rc-tabs-1-tab-orders | ');
			await driver.findElement(By.id('rc-tabs-1-tab-orders')).click();
			await sleep(5000);

			console.log(' 16 | assertText | xpath=//*[@id="rc-tabs-1-panel-orders"]/div/h1 | Active Orders');
			assert(await driver.findElement(By.xpath('//*[@id="rc-tabs-1-panel-orders"]/div/h1')).getText() == 'Active Orders');
		
	    console.log(' 18 | click | id=rc-tabs-3-tab-sell | ');
			await driver.findElement(By.id('rc-tabs-3-tab-sell')).click();
			await sleep(5000);

			console.log(' 19 | assertText | xpath=//*[@id=rc-tabs-3-panel-sell]/div/div/div/div/div/div/div/div/div/table/tbody/tr/td/div/p | No Data');
			assert(await driver.findElement(By.xpath('//*[@id="rc-tabs-3-panel-sell"]/div/div/div/div/div/div/div/div/div/table/tbody/tr/td/div/p')).getText() == 'No Data');
		
			console.log(' 20 | click | id=rc-tabs-1-tab-trade | ');
			await driver.findElement(By.id('rc-tabs-1-tab-trade')).click();
		
			console.log(' 21 | click | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(6) | ');
			await sleep(5000);
		
			console.log(' 22 | assertElementPresent | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(6) > time | ');
			{
				const elements = await driver.findElements(By.css('.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(6) > time'));
				assert(elements.length);
			}
		
			console.log(' 23 | click | id=rc-tabs-1-tab-deposits | ');
			await driver.findElement(By.id('rc-tabs-1-tab-deposits')).click();
			await sleep(4000);

			console.log(' 24 | click | css=.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			await driver.findElement(By.css('.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)')).click();
			await sleep(5000);

			console.log(' 25 | assertElementPresent | css=.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			{
				const elements = await driver.findElements(By.css('.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}

			console.log(' 26 | click | id=rc-tabs-1-tab-withdrawals | ');
			await driver.findElement(By.id('rc-tabs-1-tab-withdrawals')).click();

			console.log(' 27 | assertElementPresent | css=.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			{
				const elements = await driver.findElements(By.css('.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}

			console.log(' 28 | click | linkText=Financials | ');
			await driver.findElement(By.linkText('Financials')).click();
			await sleep(5000);

			console.log(' 29 | click | css=.app_container-content > .ant-alert | ');
			await driver.findElement(By.css('.app_container-content > .ant-alert')).click();
			await sleep(5000);

			console.log(' 30 | assertText | css=.app_container-content > .ant-alert > .ant-alert-description | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.app_container-content > .ant-alert > .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
		
			console.log(' 31 | click | css=.ant-card-body > .ant-alert | ');
			await driver.findElement(By.css('.ant-card-body > .ant-alert')).click();
		
			console.log(' 32 | assertText | css=.ant-card-body .ant-alert-description | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-card-body .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
		
			console.log(' 33 | click | id=rc-tabs-4-tab-1 | ');
			await driver.findElement(By.id('rc-tabs-4-tab-1')).click();
		
			console.log(' 34 | click | xpath=//*[@id="rc-tabs-4-panel-1"]/div/div[1]/button | ');
			await driver.findElement(By.xpath('//*[@id="rc-tabs-4-panel-1"]/div/div[1]/button')).click();
			await sleep(5000);
		
			console.log(' 35 | assertText | css=.sub-title | Asset:');
			assert(await driver.findElement(By.css('.sub-title')).getText() == 'Asset:')
			
			console.log(' 36 | click | css=.btn-wrapper > .ant-btn:nth-child(1) |');
			await driver.findElement(By.css('.btn-wrapper > .ant-btn:nth-child(1)')).click();
			await sleep(3000);

			console.log(' 37 | click | id=rc-tabs-4-tab-2 | ');
			await driver.findElement(By.id('rc-tabs-4-tab-2')).click();
			await sleep(5000);

			console.log(' 38 | click | css=.ant-table-row:nth-child(1) .d-flex | ');
			await driver.findElement(By.css('.ant-table-row:nth-child(1) .d-flex')).click();
			await sleep(5000);
		
			console.log(' 39 | assertText | css=.ant-table-row:nth-child(1) .d-flex | Validated');
			assert(await driver.findElement(By.css('.ant-table-row:nth-child(1) .d-flex')).getText() == 'Validated');
			await sleep(5000);

			console.log(' 40 | click | id=rc-tabs-4-tab-3 | ');
			await driver.findElement(By.id('rc-tabs-4-tab-3')).click();
			await sleep(5000);
		
			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	//Supervisor();
})
module.exports.Supervisor = Supervisor;