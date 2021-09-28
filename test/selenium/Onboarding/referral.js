//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function Referral(){
	const { Builder, By, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
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
	const { hasUncaughtExceptionCaptureCallback } = require('process');
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
	let User = process.env.NEW_USER;
	let passWord = process.env.PASSWORD;
	let signUpPage = process.env.SIGN_UP_PAGE;
	let emailAdmin =process.env.Email_ADMIN_USERNAME;
	let logInPage = process.env.LOGIN_PAGE;
	let userName = process.env.ADMIN_USER;
	let apassWord = process.env.ADMIN_PASS;
	let website = process.env.WEBSITE;
	const newUser = util.defineNewUser(User,4) ;
	console.log(newUser);
	let step = util.getStep();

	describe('NewUserRequest', function() {
		this.timeout(100000);
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
			let step = util.getStep()
		});

		afterEach(async function() {
			util.setStep(step);
		//	await driver.quit();
		});
		it('CurrentUser', async function() {
			console.log(' Step # | action | target | value');
		
			console.log(step++,'  | open | ',logInPage);
			await driver.get(logInPage);
			await sleep(10000);

			console.log(step++,'  | type | name=email | USER@bitholla.com')
			await driver.findElement(By.name('email')).sendKeys(userName);
		
			console.log(step++,'  | type | name=password | bitholla@bitholla.com')
			await driver.findElement(By.name('password')).sendKeys(apassWord);
			await sleep(4000);
		
			console.log(step++,'  | click | name=email |  ')
   		await driver.findElement(By.name('email')).click();
		
		   console.log(step++,'  | click | css=.holla-button |  ')
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.trade-account-link:nth-child(2) > .pointer |  ')
			await driver.findElement(By.css('.trade-account-link:nth-child(2) > .pointer')).click();
			await sleep(4000);
		
			console.log(step++,'   | click | css=.user_refer_info |  ')
			await driver.findElement(By.css('.user_refer_info')).click();
		
			console.log(step++,'  | storeText | css=.user_refer_info > .edit-wrapper__container | currentNumber')
			vars['currentNumber'] = await driver.findElement(By.css('.user_refer_info > .edit-wrapper__container')).getText();
		
			console.log(step++,'  | pause | 5000 |  ')
			console.log(vars['currentNumber']);
	   
			console.log(step++,'  | click | css=.mr-5 |  ')
			await driver.findElement(By.css('.mr-5')).click();
		
			console.log(step++,' | click | css=.app-bar-account-content > div:nth-child(2) |  ')
			await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
		
			console.log(step++,' | click | xpath=//*[@id="tab-account-menu"]/div[11]/div[3] |  ')
			await driver.findElement(By.xpath('//*[@id="tab-account-menu"]/div[11]/div[3]')).click();
	  
	        console.log(step++,'  | open | ',signUpPage);
			await driver.get(signUpPage);
			await sleep(5000);

			console.log(step++,'  | type | name=email |',newUser);
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).clear();
			await driver.findElement(By.name('email')).sendKeys(newUser);
     
			console.log(step++,'  | type | name=password | password!');
			await driver.findElement(By.name('password')).clear();
			await driver.findElement(By.name('password')).sendKeys(passWord);
      
      
			console.log(step++,'  | type | name=password_repeat | your password again!');
			await driver.findElement(By.name('password_repeat')).clear();
			await driver.findElement(By.name('password_repeat')).sendKeys(passWord);
			await sleep(2000);
		
			console.log(step++,'  |type | referral | https://sandbox.hollaex.com/signup?affiliation_code=KLUTI0')
			await driver.findElement(By.name('referral')).clear();
			await driver.findElement(By.name('referral')).sendKeys('KLUTI0');
		
			console.log(step++,'  | click | name=terms |'); 
			await driver.findElement(By.name('terms')).click();
			await sleep(10000);
		
			console.log(step++,'  | click | css=.holla-button |'); 
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
			await driver.findElement(By.css('.holla-button')).click();
			await driver.executeScript('window.scrollTo(0,0)');
			await sleep(5000);
		
			// there is no need for verification
			//	util.adminVerifiesNewUser(driver,userName,apassWord,newUser)
		
			console.log(step++,'  | type | name=email | USER@bitholla.com ')
			await driver.findElement(By.name('email')).sendKeys(userName);
		
			console.log(step++,'  | type | name=password | bitholla@bitholla.com ')
			await driver.findElement(By.name('password')).sendKeys(apassWord);
			await sleep(4000);
		
			console.log(step++,'  | click | name=email |  ')
   		await driver.findElement(By.name('email')).click();
		
			console.log(step++,'  | click | css=.holla-button |  ')
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.trade-account-link:nth-child(2) > .pointer | ') 
			await driver.findElement(By.css('.trade-account-link:nth-child(2) > .pointer')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.user_refer_info |  ')
			await driver.findElement(By.css('.user_refer_info')).click();
		
			console.log(step++,'  | storeText | css=.user_refer_info > .edit-wrapper__container | currentNumber ')
			vars['newNumber'] = await driver.findElement(By.css('.user_refer_info > .edit-wrapper__container')).getText();
		
			console.log(step++,'  | assert | newNumber<>currentNumber |  ')
		
			console.log(vars['newNumber']);
			expect(vars['newNumber']).to.not.equal(vars['currentNumber']);
		
			console.log(vars['currentNumber']+' became '+vars['newNumber']);

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	//Referral();
})
module.exports.Referral = Referral ;