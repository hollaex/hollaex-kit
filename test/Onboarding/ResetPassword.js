//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const scrap = require('./scraper');
const defNewUser = require('./newUser');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

let userName =  defNewUser.getNewUser();
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
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('Rest Password', async function() {
		console.log('// Test name: Reset Password');
		console.log(' Step # | name | target | value');
		console.log(' 1 | open | https://sandbox.hollaex.com/reset-password | ');
		await driver.get(webSite+'reset-password');
		console.log(' 2 | setWindowSize | 1050x660 | ');
		await driver.manage().window().setRect(1050, 660);
		console.log(' 3 | click | name=email | ');
		await sleep(5000);
		await driver.findElement(By.name('email')).click();
		console.log(' 4 | type | name=email |'+userName);
		await driver.findElement(By.name('email')).sendKeys(userName);
		console.log(' 5 | click | css=.holla-button | ');
		await sleep(5000);
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 6 | click | css=.icon_title-wrapper | ');
		await sleep(5000);
		//console.log("await driver.findElement(By.css(".icon_title-wrapper")).click()");
		console.log(' 7 | assertText | css=.icon_title-text | Password Reset Sent');
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Password Reset Sent');
		console.log(' 8 | click | css=.holla-button:nth-child(1) | ');
		driver.close();
		await sleep(10000);
	});

	it('Email Confirmation', async function() {
		console.log('Test name: Confirmation');
		console.log('Step # | name | target | value');
		await defNewUser.emailLogIn(driver,emailAdmin,passWord);
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
		await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
		console.log('9 | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
		{
			const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
			await driver.actions({ bridge: true}).doubleClick(element).perform();
		}
		console.log('10 | selectFrame | index=1 | ');
		await driver.switchTo().frame(1);
		await sleep(10000);
		console.log('12 | storeText | xpath=/html/body/pre/a[16] | content');
		vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[16]')).getText();
		const emailCont = await driver.findElement(By.css('pre')).getText();
		console.log('13 | echo | ${content} | ');
		console.log(vars['content']);
		console.log('14 | assertText | xpath=/html/body/pre/a[16] | ${content}');
		expect(vars['content']).to.equal(userName.toLowerCase());
     
		console.log('15 | storeAttribute | yourwebsite/reset-password | mytextlink');
		{
			const attribute = webSite+'reset-password'
			vars['mytextlink'] = attribute;
		}
		console.log('16 | echo | ${mytextlink} | ');
		console.log(vars['mytextlink']);
		console.log('17 |link starts with'+ webSite+'reset-password');
		console.log(webSite+'reset-password');
		console.log('18 | open | ${mytextlink} | ');
		
		const completedLink = await scrap.addRest(emailCont,vars['mytextlink']);
		await console.log(completedLink);
		await driver.get(completedLink);
		console.log('19 | selectFrame | relative=parent | ');
		await sleep(10000);
		console.log(' 20 | type | name=password | password!');
		await driver.findElement(By.name('password')).sendKeys(passWord);
		console.log(' 21 | type | name=password_repeat | password');
		await driver.findElement(By.name('password_repeat')).sendKeys(passWord);
		await sleep(2000);
		console.log(' 22 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		await driver.findElement(By.css('.icon_title-wrapper')).click()
		console.log('23 | assertText | css=.icon_title-text | Success');
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success')
	});
});
