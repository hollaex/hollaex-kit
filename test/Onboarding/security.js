const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const totp = require('totp-generator');
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
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
let userName = process.env.BOB;
let passWord = process.env.PASSWORD;
let newPass = process.env.NEWPASS;
let logInPage = process.env.LOGIN_PAGE;
let website = process.env.WEBSITE;
describe('OTP', function() {
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
		vars = {};
		await driver.manage().window().maximize();
	});
	afterEach(async function() {
		//await driver.quit();
	});
	it('OTP', async function() {
		console.log ('  Test name: OTP');
		console.log ('  Step # | name | target | value ');
		
		console.log ('  1 | open | login | ');
		await driver.get(logInPage);
		await sleep(4000);
					
		console.log ('  2 | click | name=email | ');
		await driver.findElement(By.name('email')).click();
		await sleep(4000);

		console.log ('  3 | type | name=password | password');
		await driver.findElement(By.name('password')).sendKeys(passWord);
		await sleep(4000);
		console.log ('  4 | type | name=email | '+userName);
		await driver.findElement(By.name('email')).sendKeys(userName);
		await sleep(4000);
		
		console.log ('  5| click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);

		console.log ('  6 | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container | ');
		await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
		await sleep(4000);
		
		console.log ('  7 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | ');
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		
		console.log ('  8 | click | css=.otp_secret | ');
		await sleep(4000);

		await driver.findElement(By.css('.otp_secret')).click();
		console.log ('  9 | storeText | css=.otp_secret | code');
		let code = vars['code'] = await driver.findElement(By.css('.otp_secret')).getText();
		
		console.log ('  10 | echo | ${code} | ');
		let token = totp(code);
		console.log(code);
		console.log(token); 
		
		console.log ('  11 | click | name=code | ');
		await driver.findElement(By.name('code')).click();
		
		console.log ('  12 | type | name=code | token');
		await driver.findElement(By.name('code')).sendKeys(token);
		await sleep(4000);
		
		console.log ('  13 | mouseOver | css=form | ');
		{
			const element = await driver.findElement(By.css('form'));
			await driver.executeScript('arguments[0].scrollIntoView(true);', element);
		}
		await sleep(4000);
		
		console.log('  14 | click | css=form |')
		await driver.findElement(By.css('form')).click();
		await sleep(4000);
			
		console.log ('  15 | click | xpath/div[5]/div/div/div[2]/div[4]/form/button | ');
		await driver.findElement(By.xpath('//div[5]/div/div/div[2]/div[4]/form/button')).click();
		await sleep(4000);

		console.log ('  16 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA');
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully activated 2FA');
		
		console.log ('  17 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);

		console.log ('  18 | click | css=.tab_item:nth-child(2) > div | ');
		await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
		await sleep(4000);
		
		console.log ('  19 | click | name=old_password | ');
		await driver.findElement(By.name('old_password')).click();
		
		console.log ('  20 | type | name=old_password | password ');
		await driver.findElement(By.name('old_password')).sendKeys(passWord);
		
		console.log ('  21 | type | name=new_password | !changed');
		await driver.findElement(By.name('new_password')).sendKeys(newPass);
		
		console.log ('  13 | click | name=new_password_confirm | ');
		await driver.findElement(By.name('new_password_confirm')).click();
		
		console.log ('  14 | type | name=new_password_confirm | !changed');
		await driver.findElement(By.name('new_password_confirm')).sendKeys(newPass);
		
		console.log ('  15 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);

		console.log ('  16 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA');
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'An email is sent to you to authorize the password change.');
		//The message was 'You have successfully changed your password' in kit 2.1

		console.log ('  17 | click | css=.holla-button | ');
		await driver.findElement(By.css('.success_display-wrapper > .holla-button')).click();
		await sleep(4000);

		console.log ('  18 | click | css=.tab_item:nth-child(3) > div | ');
		await driver.findElement(By.css('.tab_item:nth-child(3) > div')).click();
		await sleep(4000);

		console.log ('  19 | click | css=.mb-4 > .edit-wrapper__container | ');
		await driver.findElement(By.css('.mb-4 > .edit-wrapper__container')).click();
		
		await sleep(4000);
		console.log ('  18 | click | name=name | ');
		await driver.findElement(By.name('name')).click();

		console.log ('  19 | type | name=name | test');
		await driver.findElement(By.name('name')).sendKeys('test');
		
		console.log ('  20 | click | css=.w-50:nth-child(3) > .holla-button | ');
		await driver.findElement(By.css('.w-50:nth-child(3) > .holla-button')).click();
		await sleep(4000);
		
		console.log ('  21 | type | name=otp_code | code');
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		
		console.log ('  22 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		
		console.log ('  23 | assertText | css=.popup_info-title > .edit-wrapper__container | Copy your API Key');
		assert(await driver.findElement(By.css('.popup_info-title > .edit-wrapper__container')).getText() == 'Copy your API Key');
		
		console.log ('  24 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await driver.findElement(By.css('.tab_item:nth-child(1) > div')).click();
		
		console.log ('  25 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | ');
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		
		console.log ('  26 | type | name=otp_code | code');
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		
		console.log ('  27 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		
		console.log ('  28 | click | css=.success_display-wrapper | ');
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);

		console.log ('  29 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully deactivated 2FA');
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully deactivated 2FA');
		
		console.log ('  30 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();

		console.log('This is the EndOfTest');

	});
	it('Re_OTP', async function() {
		console.log ('  Test name: OTP ');
		console.log ('  Step # | name | target | value ');
		
		console.log ('  1 | open | login |  ');
		await driver.get(logInPage);
		await sleep(4000);

		console.log ('  2 | click | name=email |  ');
		await driver.findElement(By.name('email')).click();
		await sleep(4000);

		console.log ('  3 | type | name=password | password ');
		await driver.findElement(By.name('password')).sendKeys(newPass);
		await sleep(4000);

		console.log ('  4 | type | name=email | '+userName );
		await driver.findElement(By.name('email')).sendKeys(userName);
		await sleep(4000);
		
		console.log ('  5 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		
		console.log ('  6 | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container |  ');
		await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
		await sleep(4000);
		
		console.log ('  7 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container |  ');
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		await sleep(4000);

		console.log ('  8 | click | css=.otp_secret |  ');
		await driver.findElement(By.css('.otp_secret')).click();
		
		console.log ('  9 | storeText | css=.otp_secret | code ');
		let code = vars['code'] = await driver.findElement(By.css('.otp_secret')).getText();
		
		console.log ('  10 | echo | ${code} |  ');
		let token = totp(code);
		console.log(code);
		console.log(token); 
		
		console.log ('  11 | click | name=code |  ');
		await driver.findElement(By.name('code')).click();
		
		console.log ('  12 | type | name=code | token ');
		await driver.findElement(By.name('code')).sendKeys(token);
		await sleep(4000)

		console.log ('  13 | mouseOver | css=form |  ');
		{
			const element = await driver.findElement(By.css('form'));
			await driver.executeScript('arguments[0].scrollIntoView(true);', element);
		}
		await sleep(4000)
		{
			console.log ('  13.1 | click| css=form |  ');
			await driver.findElement(By.css('form')).click();
			await sleep(4000);
		}
		console.log ('  14 | click | css=.success_display-wrapper |  ');
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);
		
		console.log ('  15 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA ');
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully activated 2FA');
		
		console.log ('  16 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);

		console.log ('  17 | click | css=.tab_item:nth-child(2) > div |  ');
		await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
		await sleep(4000);

		console.log ('  18 | click | name=old_password |  ');
		await driver.findElement(By.name('old_password')).click();
		
		console.log ('  19 | type | name=old_password | password ');
		await driver.findElement(By.name('old_password')).sendKeys(newPass);
		
		console.log ('  20 | type | name=new_password | !changed ');
		await driver.findElement(By.name('new_password')).sendKeys(passWord);
		
		console.log ('  21 | click | name=new_password_confirm |  ');
		await driver.findElement(By.name('new_password_confirm')).click();

		console.log ('  22 | type | name=new_password_confirm | !changed ');
		await driver.findElement(By.name('new_password_confirm')).sendKeys(passWord);
		
		console.log ('  23 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);

		console.log ('  24 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA ');
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully changed your password');
		
		console.log ('  25 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.success_display-wrapper > .holla-button')).click();
		await sleep(4000);
		
		console.log ('  26 | click | css=.tab_item:nth-child(3) > div |  ');
		await driver.findElement(By.css('.tab_item:nth-child(3) > div')).click();
		await sleep(4000);
		
		console.log ('  27 | click | css=.mb-4 > .edit-wrapper__container |  ');
		await driver.findElement(By.css('.mb-4 > .edit-wrapper__container')).click();
		await sleep(4000);

		console.log ('  28 | click | name=name |  ');
		await driver.findElement(By.name('name')).click();
		
		console.log ('  29 | type | name=name | test ');
		await driver.findElement(By.name('name')).sendKeys('test');
		
		console.log ('  30 | click | css=.w-50:nth-child(3) > .holla-button |  ');
		await driver.findElement(By.css('.w-50:nth-child(3) > .holla-button')).click();
		await sleep(4000);
		
		console.log ('  31 | type | name=otp_code | code ');
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		
		console.log ('  32 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);

		console.log ('  33 | assertText | css=.popup_info-title > .edit-wrapper__container | Copy your API Key ');
		assert(await driver.findElement(By.css('.popup_info-title > .edit-wrapper__container')).getText() == 'Copy your API Key');
		
		console.log ('  34 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();
		await driver.findElement(By.css('.tab_item:nth-child(1) > div')).click();
		
		console.log ('  35 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container |  ');
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		
		console.log ('  36 | type | name=otp_code | code ');
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		
		console.log ('  37 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		
		console.log ('  38 | click | css=.success_display-wrapper | ');
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);

		console.log ('  39 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully deactivated 2FA ');
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully deactivated 2FA');
		
		console.log ('  40 | click | css=.holla-button |  ');
		await driver.findElement(By.css('.holla-button')).click();

		console.log('This is the EndOfTest');
	});
});
