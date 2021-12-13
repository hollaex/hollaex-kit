// KYC 
async function Kyc(){
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
	let KYC = process.env.KYC;
	let password = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)

	describe('KYC', function() {
		this.timeout(3000000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}
		beforeEach(async function() {
			driver = await new Builder().forBrowser(browser).build();
			driver.manage().window().maximize();
			vars = {};
		});
		afterEach(async function() {
		//	await driver.quit();
		});
		it('KYC', async function() {
			console.log(' KYC role can access some user data to review KYC requirements');
			console.log(' Test name: KYC');
			console.log(' Step # | name | target | value');
		
			console.log(step++,'  | open | /login | ');
			await driver.get(logInPage);
			driver.manage().window().maximize();
			await sleep(5000);
		
			console.log(step++,'  | type | name=email |'+KYC);
			await driver.findElement(By.name('email')).sendKeys(KYC);
		
			console.log(step++,'  | type | name=password | Password');
			await driver.findElement(By.name('password')).sendKeys(password);
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);
		
			
			console.log(step++,'  | click | css=a > .pl-1 | ');
			await driver.findElement(By.css('a > .pl-1')).click();
			await sleep(5000);
			
			console.log(step++,'  | assertText | css=.sub-label | KYC');
			assert(await driver.findElement(By.css('.sub-label')).getText() == 'KYC');
			await sleep(5000);

			console.log(step++,'  | click | css=.role-section > div:nth-child(2) | ');
			await driver.findElement(By.css('.role-section > div:nth-child(2)')).click();
		
			console.log(step++,'  | assertText | css=.sub-label | KYC');
			assert(await driver.findElement(By.css('.sub-label')).getText() == 'KYC');

			console.log(step++,'  | click | css=.active-side-menu | ');
			await sleep(5000);
			// await driver.findElement(By.css(".active-side-menu")).click()
			await driver.findElement(By.linkText('Users')).click();
		
			console.log(step++,'  | click | name=id | ');
			await driver.findElement(By.name('id')).click();
		
			console.log(step++,'  | type | name=id | 1');
			await driver.findElement(By.name('id')).sendKeys('1');
		
			console.log(step++,'  | sendKeys | name=id | ${KEY_ENTER}');
			await driver.findElement(By.name('id')).sendKeys(Key.ENTER);
		
			console.log(' 12 | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
		
			console.log(step++,'  | click | id=rc-tabs-8-tab-bank | ');
			await sleep(5000);
			await driver.findElement(By.id('rc-tabs-1-tab-bank')).click();
		
			console.log(step++,'  | click | css=.ant-col:nth-child(1) .ant-card-head-wrapper | ');
			await driver.findElement(By.css('.ant-col:nth-child(1) .ant-card-head-wrapper')).click();
		
			console.log(step++,'  | assertElementPresent | css=.ant-col:nth-child(1) .ant-card-head-title |  |'); 
			{
				const elements = await driver.findElements(By.css('.ant-col:nth-child(1) .ant-card-head-title'));
				assert(elements.length);
			}

			console.log(step++,'  | click|linkText = Assets | ');
			await driver.findElement(By.linkText('Assets')).click();
			await sleep(5000);

			console.log(step++,'  | assertText | css=.ant-empty-description | No Data');
			assert(await driver.findElement(By.css('.ant-empty-description')).getText() == 'No Data');
		    await sleep(5000);
			
			console.log(step++,'  | click | id=rc-tabs-2-tab-1 | ');
			await driver.findElement(By.id('rc-tabs-2-tab-1')).click();
			await sleep(5000);
		
			console.log(step++,'  | assertText | xpath= //span[contains(.,"Access denied: User is not authorized to access this endpoint")]');
			assert(await driver.findElement(By.xpath("//span[contains(.,'Access denied: User is not authorized to access this endpoint')]")).getText() == 'Access denied: User is not authorized to access this endpoint');
			await sleep(5000);
				
			console.log(step++,' | click | id =rc-tabs-2-tab-2 | ');
			await driver.findElement(By.id('rc-tabs-2-tab-2')).click();
			await sleep(5000);
		
			console.log(step++,'  | click | css=.ant-alert-closable | ');
			await driver.findElement(By.css('.ant-alert-closable')).click();
			await sleep(5000);

			console.log(step++,'  | assertText | css=.ant-alert-closable > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-alert-closable > .ant-alert-message')).getText() == 'Access denied: User is not authorized to access this endpoint');
			util.takeHollashot(driver,reportPath,step);
			await sleep(5000);

			console.log(step++,'  | click | id=rc-tabs-2-tab-3 | ');
			await driver.findElement(By.id('rc-tabs-2-tab-3')).click();
			await sleep(4000);

			console.log('should be fixed');
			let y=await driver.findElement(By.xpath('//div[4]/div/div/div/div[2]')).getText()
			console.log(y)	

		   console.log(step++,'  | assertText | css=.ant-alert-error | Access denied: User is not authorized to access this endpoint');
		   //assert(await driver.findElement(By.css(".ant-alert-error")).getText() == "Access denied: User is not authorized to access this endpoint\\\\nClose")
		   //util.takeHollashot(driver,reportPath,22);
		   await sleep(5000);
					   
		   console.log('should be fixed');
		   // console.log(step++,'  | assertText | xpath = //*[@id="rc-tabs-1-panel-3"]/div/div/div/div[2] | Access denied: User is not authorized to access this endpoint');
		   // console.log(await driver.findElement(By.xpath('//*[@id="rc-tabs-1-panel-3"]/div/div/div/div[2]')).getText() )
		   // assert(await driver.findElement(By.xpath('//*[@id="rc-tabs-1-panel-3"]/div/div/div/div[2]')).getText() == 'Access denied: User is not authorized to access this endpoint');
		   // util.takeHollashot(driver,reportPath,1);

			console.log(step++,'  | click | id=rc-tabs-2-tab-4 | ');
			await driver.findElement(By.id('rc-tabs-2-tab-4')).click();
			await sleep(4000);
			
            console.log(step++,'  | click | css=.button:nth-child(1) > span | ');
			await driver.findElement(By.css('.button:nth-child(1) > span')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.modal-button:nth-child(2) > span| ');
			await driver.findElement(By.css('.modal-button:nth-child(2) > span')).click();
			await sleep(1000);

			console.log(step++,'  | assertText | css=.ant-message-custom-content > span:nth-child(2) | Access denied: User is not authorized to access this endpoint');
			assert(await driver.findElement(By.css('.ant-message-custom-content > span:nth-child(2)')).getText() == 'Access denied: User is not authorized to access this endpoint');
			util.takeHollashot(driver,reportPath,22);
			await sleep(5000);

			console.log(step++,'  | click | id=rc-tabs-2-tab-5 | ');
			await driver.findElement(By.id('rc-tabs-2-tab-5')).click();
			await sleep(5000);
			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
//	Kyc();
})
module.exports.Kyc = Kyc;