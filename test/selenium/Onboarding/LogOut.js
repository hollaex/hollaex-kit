//testing the logout function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function LogOut(){
	const { Builder, By, until } = require('selenium-webdriver');
	const { expect } = require('chai');
	const { Console } = require('console');
	const path = require('path');
	const fs = require('fs');
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('./../Utils/Utils.js');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' ,
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
	let userName = process.env.BOB;
	let passWord = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;
	let signUpPage = process.env.SIGN_UP_PAGE;
	let emailPage = process.env.EMAIL_PAGE;
	let emailPass =process.env.EMAIL_PASS ;
	let emailAdmin = process.env.EMAIL_ADMIN_USERNAME ;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)
	

	if (process.env.NODE_ENV == 'test') {
		console.log('Variables are defined');
	}
	describe('BobLogOut', function() {
		this.timeout(300000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		} 
		function shot(){util.takeHollashot(driver,reportPath,step);}
		beforeEach(async function() {
			driver = await new Builder().forBrowser('browser').build();
			vars = {};
			driver.manage().window().maximize();
			let step = util.getStep()
			
		});
		afterEach(async function() {
			await util.setStep(step);
		//	await driver.quit();
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
			
		   console.log(step++,' | click | css=.app-bar-account-content > div:nth-child(2) | ');
           await driver.findElement(By.css(".app-bar-account-content > div:nth-child(2)")).click();
		   await sleep(5000);

		    console.log(step++,'| click | css=.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3) | ');
            await driver.findElement(By.css(".app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3)")).click()
			await sleep(5000);

			console.log(step++,' | assertText | css=.icon_title-text | Login');
			expect(await driver.findElement(By.css('.icon_title-text')).getText()).to.equal( 'Login');
		    await sleep(2000);
			shot();
			await sleep(2000);
			
			console.log('This is the EndOfTest');
		
 	});
	 it('Email Confirmation', async function() {
		console.log('Test name: Confirmation');
		console.log('Step # | name | target | value');
	
		await util.emailLogIn(step,driver,emailAdmin,emailPass);
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
		await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
	
		console.log(step++,'   | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
		{
			const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
			await driver.actions({ bridge: true}).doubleClick(element).perform();
		}
		await sleep(5000);

		console.log(step++,'   | selectFrame | index=1 | ');
		await driver.switchTo().frame(1);
		await sleep(10000);
	
		console.log(step++,'   | storeText | xpath=/html/body/pre/a[16] | content');
		vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[16]')).getText();
		const emailCont = await driver.findElement(By.css('pre')).getText();
	
		console.log(step++,'  | echo | ${content} | ');
		console.log(vars['content']);
		
		console.log(step++,'   | assertText | xpath=/html/body/pre/a[16] | ${content}');
		expect(vars['content']).to.equal(userName.toLowerCase());

		console.log(step++,'   | assertText | email body contains] | We have recorded a login to your account with the following details');
		expect(util.chunkCleaner(emailCont).includes("We have recorded a login to your account with the following details")).to.be.true
				
		console.log('This is the EndOfTest');
				
	});
	});
}
describe('Main Test', function () {
 
	// LogOut();
})
module.exports.LogOut = LogOut;
