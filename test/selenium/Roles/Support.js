// support
async function Support(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const path = require('path');
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('../Utils/Utils.js');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, './../.env') });
	let support = process.env.SUPPORT;
	let password = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;
	let webSite = process.env.WEBSITE;
	//let browser = process.env.BROWSER;
	let browser = 'MicrosoftEdge';
	let step = util.getStep();
	util.logHolla(logPath)

	describe('support ', function() {
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
			driver.manage().window().maximize();
			vars = {};
		});
		afterEach(async function() {
		//	await driver.quit();
		});
		it('support', async function() {
			console.log('Support can access some user information for user verification');
			console.log('Test name: support');
			console.log('Step # | name | target | value');
		
			console.log(step++,'  | open | /login | ');
			await driver.get(logInPage);
			driver.manage().window().maximize();
		
			console.log(step++,'  | wait 5000 | \'Supervisor can access all deposit, withdrawals and approval settings\' |'); 
			await sleep(5000);
		
			console.log(step++,'  | type | name=email |'+support);
			await driver.findElement(By.name('email')).sendKeys(support);
		
			console.log(step++,'  | type | name=password | password!');
			await driver.findElement(By.name('password')).sendKeys(password);
			await sleep(5000);
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=a > .pl-1 | ');
			await driver.findElement(By.css('a > .pl-1')).click();
			await sleep(2000);

			console.log(step++,'  | click | css=.role-section > div:nth-child(2) | ');
			await driver.findElement(By.css('.role-section > div:nth-child(2)')).click();
		
			console.log(step++,'  | assertText | css=.sub-label | Support');
			assert(await driver.findElement(By.css('.sub-label')).getText() == 'Support');
		
			
			console.log(step++,'  | click | linkText=Users | ');
			await driver.findElement(By.linkText('Users')).click();
		    await sleep(2000);

			console.log(step++,'  | click | name=id | ');
			await driver.findElement(By.name('id')).click();
		    await sleep(2000);

			console.log(step++,'  | type | name=id | 1');
			await driver.findElement(By.name('id')).sendKeys('1');
		    await sleep(2000);

			console.log(step++,'  | sendKeys | name=id | ${KEY_ENTER}');
			await driver.findElement(By.name('id')).sendKeys(Key.ENTER);
			await sleep(2000);

			console.log(step++,'  | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
		    await sleep(2000);

			console.log(step++,'  | click | css=div:nth-child(2) > .ant-btn-sm > span | ');
			await driver.findElement(By.css('div:nth-child(2) > .ant-btn-sm > span')).click();
			await sleep(2000);

			await driver.findElement(By.name("phone_number")).click()
			await sleep(2000);

			console.log(step," | type | name=phone_number | 123456789")
			await driver.findElement(By.name("phone_number")).sendKeys("123456789")
			await sleep(2000);

			console.log(step,"| click | css=.w-100 | ")
			await driver.findElement(By.css(".w-100")).click()
			await sleep(2000);

			console.log(step," | click | css=div:nth-child(11) | ")
			await driver.findElement(By.css("div:nth-child(11)")).click()
			await sleep(2000);

			console.log(step," | assertText | css=div:nth-child(11) > strong | Access denied: User is not authorized to access this endpoint")
			assert(await driver.findElement(By.css("div:nth-child(11) > strong")).getText() == "Access denied: User is not authorized to access this endpoint")
			await sleep(2000);

			// console.log(step++,'  | assertNotEditable | name=email | ');
			// {
			// 	const element = await driver.findElement(By.name('email'));
			// 	assert(!await element.isEnabled());
			// }
		
			console.log(step++,'  | click | closing| ');
			// await driver.findElement(By.css('.anticon-close > svgn')).click();
			await driver.get(webSite+"admin/financials");
			// https://sandbox.hollaex.com/admin/financials
			 await sleep(5000);

			// console.log(step++,'  | click | linkText=Assets | ');
			// await driver.findElement(By.linkText('Assets')).click();
			// await sleep(5000);

			// console.log(step++,'  | click | css=.app_container-content > .ant-alert | ');
			// await driver.findElement(By.css('.app_container-content > .ant-alert')).click();
			// await sleep(5000);
		
			console.log(step++,'  | assertText | css=.ant-empty-description | No Data');
			assert(await driver.findElement(By.css('.ant-empty-description')).getText() == 'No Data');
		    await sleep(5000);
						
			console.log(step++,'  | click | id=rc-tabs-0-tab-1 | ');
			await driver.findElement(By.id('rc-tabs-0-tab-1')).click();
			await sleep(5000);
			
			console.log(step++,'  | click | css=.ant-card-body > .ant-alert | ');
			await driver.findElement(By.css('.ant-card-body > .ant-alert')).click();
			await sleep(5000);
		
			console.log(step++,'  | assertText | css=.ant-card-body .ant-alert-description | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-card-body .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
			util.takeHollashot(driver,reportPath,16);

			// console.log(step++,'  | click | xpath=//*[@id="rc-tabs-2-panel-1"]/div/div[1]/button | ');
			// await driver.findElement(By.xpath('//*[@id="rc-tabs-2-panel-1"]/div/div[1]/button')).click();
			// await sleep(5000);
		
			// console.log(step++,'  | assertText | css=.sub-title | Asset:');
			// assert(await driver.findElement(By.css('.sub-title')).getText() == 'Asset:')
			
			// console.log(step++,'  | click | css=.btn-wrapper > .ant-btn:nth-child(1) |');
			// await driver.findElement(By.css('.btn-wrapper > .ant-btn:nth-child(1)')).click();
			// await sleep(3000);
		
			console.log(step++,'  | click | id=rc-tabs-0-tab-2 | ');
			await driver.findElement(By.id('rc-tabs-0-tab-2')).click();
			await sleep(5000);

			console.log(step++,'  | assertText | css=.ant-alert-closable > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-alert-closable > .ant-alert-message')).getText() == 'Access denied: User is not authorized to access this endpoint');
		
			console.log(step++,' | click | id=rc-tabs-0-tab-3 | ');
			await driver.findElement(By.id('rc-tabs-0-tab-3')).click();
			await sleep(5000);

			// console.log(step++,'  | assertText | css=.ant-alert-closable > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
			// assert(await driver.findElement(By.css('.ant-alert-closable > .ant-alert-message')).getText() == 'Access denied: User is not authorized to access this endpoint');
			// await sleep(5000);

			console.log(step++,' | click | id=rc-tabs-0-tab-4 | ');
			await driver.findElement(By.id('rc-tabs-0-tab-4')).click();
			await sleep(5000);
			
			console.log(step++,'  | click | css=.button:nth-child(1) > span | ');
			await driver.findElement(By.css('.button:nth-child(1) > span')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.modal-button:nth-child(2) > span| ');
			await driver.findElement(By.css('.modal-button:nth-child(2) > span')).click();
			await sleep(1000);

			console.log(step++,'  | assertText | css=.ant-message-custom-content > span:nth-child(2) | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-message-custom-content > span:nth-child(2)')).getText() == 'Access denied: User is not authorized to access this endpoint');
			util.takeHollashot(driver,reportPath,step);
			await sleep(5000);


			console.log(step++,' | click | id=rc-tabs-0-tab-5 | ');
			await driver.findElement(By.id('rc-tabs-0-tab-5')).click();
			await sleep(5000);

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
//	Support();
})
module.exports.Support = Support;