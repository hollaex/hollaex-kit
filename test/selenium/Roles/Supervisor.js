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
	let step = util.getStep();
	util.logHolla(logPath)

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
		
			console.log(step++,'  | open | /login | ');
			await driver.get(logInPage);
			await sleep(5000);
		
			console.log(step++,'  | type | name=email |'+supervisor);
			await driver.findElement(By.name('email')).sendKeys(supervisor);
		
			console.log(step++,'  | type | name=password | password');
			await driver.findElement(By.name('password')).sendKeys(password);
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=a > .pl-1 | ');
			await sleep(5000);
			await driver.findElement(By.css('a > .pl-1')).click();
		
			console.log(step++,'  | click | linkText=Users | ');
			await driver.findElement(By.linkText('Users')).click();
			await sleep(5000);

			console.log(step++,'  | click | name=id | ');
			await driver.findElement(By.name('id')).click();

			console.log(step++,'  | type | name=id | 1');
			await driver.findElement(By.name('id')).sendKeys('1');
		
			console.log(step++,'  | sendKeys | name=id | ${KEY_ENTER}');
			await driver.findElement(By.name('id')).sendKeys(Key.ENTER);
		
			console.log(step++,'  | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
			await sleep(5000);

			console.log(step++,'  | click | id=rc-tabs-1-tab-balance | ');
			await driver.findElement(By.id('rc-tabs-1-tab-balance')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			await driver.findElement(By.css('.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)')).click();
			await sleep(5000);
		
			console.log(step++,'  | assertElementPresent | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) |'); 
			{
				const elements = await driver.findElements(By.css('.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}
		
			console.log(step++,'  | assertElementPresent | css=.ant-table-row:nth-child(2) > .ant-table-cell:nth-child(5) | ');
			{
				const elements = await driver.findElements(By.css('.ant-table-row:nth-child(2) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}
		
			console.log(step++,'  | click | id=rc-tabs-1-tab-orders | ');
			await driver.findElement(By.id('rc-tabs-1-tab-orders')).click();
			await sleep(5000);

			console.log(step++,'  | assertText | xpath=//*[@id="rc-tabs-1-panel-orders"]/div/h1 | Active Orders');
			assert(await driver.findElement(By.xpath('//*[@id="rc-tabs-1-panel-orders"]/div/h1')).getText() == 'Active Orders');
		
			console.log(step++,'  | click | id=rc-tabs-3-tab-sell | ');
			await driver.findElement(By.id('rc-tabs-3-tab-sell')).click();
			await sleep(5000);

			console.log(step++,'  | assertText | xpath=//*[@id=rc-tabs-3-panel-sell]/div/div/div/div/div/div/div/div/div/table/tbody/tr/td/div/p | No Data');
			assert(await driver.findElement(By.xpath('//*[@id="rc-tabs-3-panel-sell"]/div/div/div/div/div/div/div/div/div/table/tbody/tr/td/div/p')).getText() == 'No Data');
		
			console.log(step++,' | click | id=rc-tabs-1-tab-trade | ');
			await driver.findElement(By.id('rc-tabs-1-tab-trade')).click();
		
			console.log(step++,' | click | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(6) | ');
			await sleep(5000);
		
			console.log(step++,'  | assertElementPresent | css=.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(6) > time | ');
			{
				const elements = await driver.findElements(By.css('.ant-table-row:nth-child(1) > .ant-table-cell:nth-child(6) > time'));
				assert(elements.length);
			}
		
			console.log(step++,' | click | id=rc-tabs-1-tab-deposits | ');
			await driver.findElement(By.id('rc-tabs-1-tab-deposits')).click();
			await sleep(4000);

			console.log(step++,'  | click | css=.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			await driver.findElement(By.css('.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)')).click();
			await sleep(5000);

			console.log(step++,'  | assertElementPresent | css=.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			{
				const elements = await driver.findElements(By.css('.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}

			console.log(step++,'  | click | id=rc-tabs-1-tab-withdrawals | ');
			await driver.findElement(By.id('rc-tabs-1-tab-withdrawals')).click();

			console.log(step++,'  | assertElementPresent | css=.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5) | ');
			{
				const elements = await driver.findElements(By.css('.app-wrapper:nth-child(2) .ant-table-row:nth-child(1) > .ant-table-cell:nth-child(5)'));
				assert(elements.length);
			}

			console.log(' 28 | click | linkText=Financials | ');
			await driver.findElement(By.linkText('Financials')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.app_container-content > .ant-alert | ');
			await driver.findElement(By.css('.app_container-content > .ant-alert')).click();
			await sleep(5000);

			console.log(step++,'  | assertText | css=.app_container-content > .ant-alert > .ant-alert-description | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.app_container-content > .ant-alert > .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
		
			console.log(step++,'  | click | css=.ant-card-body > .ant-alert | ');
			await driver.findElement(By.css('.ant-card-body > .ant-alert')).click();
		
			console.log(step++,'  | assertText | css=.ant-card-body .ant-alert-description | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-card-body .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
		
			console.log(step++,'  | click | id=rc-tabs-4-tab-1 | ');
			await driver.findElement(By.id('rc-tabs-4-tab-1')).click();
		
			console.log(step++,'  | click | xpath=//*[@id="rc-tabs-4-panel-1"]/div/div[1]/button | ');
			await driver.findElement(By.xpath('//*[@id="rc-tabs-4-panel-1"]/div/div[1]/button')).click();
			await sleep(5000);
		
			console.log(step++,'  | assertText | css=.sub-title | Asset:');
			assert(await driver.findElement(By.css('.sub-title')).getText() == 'Asset:')
			
			console.log(step++,'  | click | css=.btn-wrapper > .ant-btn:nth-child(1) |');
			await driver.findElement(By.css('.btn-wrapper > .ant-btn:nth-child(1)')).click();
			await sleep(3000);

			console.log(step++,' | click | id=rc-tabs-4-tab-2 | ');
			await driver.findElement(By.id('rc-tabs-4-tab-2')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.ant-table-row:nth-child(1) .d-flex | ');
			await driver.findElement(By.css('.ant-table-row:nth-child(1) .d-flex')).click();
			await sleep(5000);
		
			console.log(step++,' | assertText | css=.ant-table-row:nth-child(1) .d-flex | Validated');
			assert(await driver.findElement(By.css('.ant-table-row:nth-child(1) .d-flex')).getText() == 'Validated');
			await sleep(5000);

			console.log(step++,'  | click | id=rc-tabs-4-tab-3 | ');
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