//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const path = require('path')
const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
const util = require('./../Utils/Utils.js');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
util.makeReportDir(reportPath);
util.makeReportDir(logPath);
require('console-stamp')(console, { 
	format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
} );
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

let userName =  util.getNewUser();
//let userName = process.env.USER_NAME;
let passWord = process.env.PASSWORD;
let webSite = process.env.WEBSITE;
let emailAdmin =process.env.Email_ADMIN_USERNAME;
if (process.env.NODE_ENV == 'test') {
	console.log('Variables are defined');
}


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
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('Rest Password', async function() {
		console.log('// Test name: Reset Password');
		console.log(' Step # | name | target | value');
		
		console.log(' 1 | open | https://website/reset-password | ');
		await driver.get(webSite+'reset-password');
		await sleep(5000);
		
		console.log(' 2 | click | name=email | ');
		await driver.findElement(By.name('email')).click();
		
		console.log(' 3 | type | name=email |'+userName);
		await driver.findElement(By.name('email')).sendKeys(userName);
		await sleep(5000);
		
		console.log(' 4 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		
		console.log(' 5 | assertText | css=.icon_title-text | Password Reset Sent');
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Password Reset Sent');
		
		console.log(' 6 | click | css=.holla-button:nth-child(1) | ');
		driver.close();
		await sleep(10000);

		console.log('This is the EndOfTest');
	});

	it('Email Confirmation', async function() {
		console.log('Test name: Confirmation');
		console.log('Step # | name | target | value');
		
		await util.emailLogIn(driver,emailAdmin,passWord);
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
		await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
		
		console.log('9 | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
		{
			const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
			await driver.actions({ bridge: true}).doubleClick(element).perform();
		}
		await sleep(5000);

		console.log('10 | selectFrame | index=1 | ');
		await driver.switchTo().frame(1);
		await sleep(10000);
		
		console.log('11 | storeText | xpath=/html/body/pre/a[16] | content');
		vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[16]')).getText();
		const emailCont = await driver.findElement(By.css('pre')).getText();
		
		console.log('12 | echo | ${content} | ');
		console.log(vars['content']);
		
		console.log('13 | assertText | xpath=/html/body/pre/a[16] | ${content}');
		expect(vars['content']).to.equal(userName.toLowerCase());
     
		console.log('14 | storeAttribute | yourwebsite/reset-password | mytextlink');
		{
			const attribute = webSite+'reset-password'
			vars['mytextlink'] = attribute;
		}
		console.log('15 | echo | ${mytextlink} | ');
		console.log(vars['mytextlink']);
		console.log('16 |link starts with'+ webSite+'reset-password');
		console.log(webSite+'reset-password');
		console.log('17 | open | ${mytextlink} | ');
		
		const completedLink = await util.addRest(emailCont,vars['mytextlink']);
		await console.log(completedLink);
		await driver.get(completedLink);
		await sleep(10000);
				
		console.log(' 18 | type | name=password | password!');
		await driver.findElement(By.name('password')).sendKeys(passWord);
		
		console.log(' 19 | type | name=password_repeat | password');
		await driver.findElement(By.name('password_repeat')).sendKeys(passWord);
		await sleep(2000);
		
		console.log(' 20 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		
		console.log(' 21 | assertText | css=.icon_title-text | Success');
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success');

		console.log('This is the EndOfTest');
	});
});
