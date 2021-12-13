//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function Verification(){
	const { Builder, By, until } = require('selenium-webdriver');
	const { expect } = require('chai');
	const { Console } = require('console');
	const assert = require('assert');
	const path = require('path')
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('../Utils/Utils.js');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
	let userName = util.getNewUser();
	//userName= 'user1@testsae.com';
	let passWord = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;
	let website = process.env.WEBSITE;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)

	if (process.env.NODE_ENV == 'test') {
		console.log('Variables are defined');
	}
	describe('Verification', function() {
		this.timeout(300000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}
		beforeEach(async function() {
			driver = await new Builder().forBrowser(browser).build();
			vars = {};
			driver.manage().window().maximize();
			let step = util.getStep()
		});

		afterEach(async function() {
			util.setStep(step);
			await driver.quit();
		});

		it('Verify', async function() {
			var parent = driver.getWindowHandle();
			var windows = driver.getAllWindowHandles();

			//Given User's data

			console.log(' Test name	: NewUser');
			console.log(' Step # | action | target | value');
			console.log(step++,' | open | '+logInPage+'| ')
			await driver.get(logInPage);
			driver.manage().window().maximize();
			await driver.sleep(5000);
    
			console.log(step++,'  | type | name=email |', userName);
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).sendKeys(userName);
    
			console.log(step++,'  | type | name=password | PASSWORD');
			await driver.wait(until.elementLocated(By.name('password')), 5000);
			await driver.findElement(By.name('password')).sendKeys(passWord);
    
			console.log(step++,'  | click | css=.auth_wrapper | ');
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.auth_wrapper'))), 5000);
			await driver.findElement(By.css('.auth_wrapper')).click();

			console.log(step++,'  | verifyElementPresent | css=.holla-button |'); 
			{
				const elements = await driver.findElements(By.css('.holla-button'));
				// assert(elements.length);
				expect(elements.length);
			}

			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);
			//when login    
	
			console.log(step++,'  | open | /verification | ')
			await driver.get(website+'verification');
			driver.manage().window().maximize();
			await sleep(5000);
		
			console.log(step++,' | click | css=.tab_item:nth-child(1) .custom_title-svg #Layer_1 | ')
			await driver.findElement(By.css('.tab_item:nth-child(1) .custom_title-svg #Layer_1')).click();
			await sleep(5000);
		
			console.log(step++,'  | click | css=.panel-information-row | ')
			await driver.findElement(By.css('.panel-information-row')).click();
			await sleep(7000);
		
			console.log(step++,'  | assertText | css=.information-content | new user')
			assert(await driver.findElement(By.css('.information-content')).getText() == userName.toLowerCase());
			await sleep(5000)
			//*[@id="root"]/div/div[2]/div/div/div[3]/div[2]/div/div/div/div/div[4]/div[2]/div/div[1]/span/span
		
			console.log(step++,'  | click | css=.verification-phone | ')
			// await sleep(5000)
			// await driver.findElement(By.css(".verification-phone")).click()
			// await sleep(5000)
			console.log('should be fixed');
		
			console.log(step++,'  | click | css=.holla-button | ')
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.d-flex > .holla-button | ')
			await driver.findElement(By.css('.d-flex > .holla-button')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.custom_title-img | ')
			await driver.findElement(By.css('.custom_title-img')).click();
			await sleep(5000);

			console.log(step++,'  | click | css=.holla-button | ')
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);
		
			console.log(step++,'  | storeWindowHandle | root | ')
			vars['root'] = await driver.getWindowHandle(windows[1]);
		
			console.log(step++,'  | selectWindow | handle=${win1649} | ')
			await driver.switchTo().window(parent);

			console.log(step++,'  | assertTitle | iDenfy | ')
			assert(await driver.getTitle() == 'iDenfy');
		
			console.log(step++,'  | selectWindow | handle=${root} | ')
			await driver.switchTo().window(vars['root']);

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
//	Verification();
})
module.exports.Verification = Verification;