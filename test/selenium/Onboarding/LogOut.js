//testing the logout function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function LogOut(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const path = require('path')
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require('../Utils/Utils.js');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	util.makeReportDir(reportPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
	let userName = process.env.BOB;
	let passWord = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;
	let signUpPage = process.env.SIGN_UP_PAGE;
	let emailPage = process.env.EMAIL_PAGE;
	let step = util.getStep();
	util.logHolla(logPath)
	

	if (process.env.NODE_ENV == 'test') {
		console.log('Variables are defined');
	}
	describe('BobLogOut', function() {
		this.timeout(30000);
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
			await driver.quit();
		});
		it('Simple log in', async function() {
			//Given The user logged in
			console.log(logInPage);
			await driver.get(logInPage);
			await driver.sleep(5000);
			const title = await driver.getTitle();
			console.log(title);
			expect(title).to.equal(title);
			console.log('entring', logInPage);
			console.log(' Step # | action | target | value');
    
			console.log(step++,' | type | name=email |',userName);
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).sendKeys(userName);
    
			console.log(step++,' | type | name=password | Password');
			await driver.wait(until.elementLocated(By.name('password')), 5000);
			await driver.findElement(By.name('password')).sendKeys(passWord);
    
			console.log(step++,' | click | css=.auth_wrapper | ');
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.auth_wrapper'))), 5000);
			await driver.findElement(By.css('.auth_wrapper')).click();
		
			console.log(step++,' | verifyElementPresent | css=.holla-button |'); 
			{
				const elements = await driver.findElements(By.css('.holla-button'));
				expect(elements.length);
			}
    
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);
			//when it is confirmed the user logged in		
			
			console.log(step++,' | assertText | css=.app-bar-account-content > div:nth-child(2) |',userName);
			await driver.wait(until.elementLocated(By.css('.app-bar-account-content > div:nth-child(2)')), 20000);
			await console.log(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText());
			expect(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText()).to.equal(userName);
			await sleep(5000);
			//Then Log out should happen 		
			
			await console.log(step++,' | click | xpath =//*[@id="root"]/div/div[2]/div/div/div[3]/div[1]/div/div[8]/div[2]/div |');
			await driver.findElement(By.xpath('//*[@id="root"]/div/div[2]/div/div/div[3]/div[1]/div/div[8]/div[2]/div')).click();
			await sleep(5000);
			
			console.log(step++,' | assertText | css=.icon_title-text | Login');
			expect(await driver.findElement(By.css('.icon_title-text')).getText()).to.equal( 'Login');
		
			console.log('This is the EndOfTest');
		
 	});
	});
}
describe('Main Test', function () {
 
	//LogOut();
})
module.exports.LogOut = LogOut;
