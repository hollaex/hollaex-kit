const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const totp = require('totp-generator');
const defNewUser = require('./newUser');
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
		
	});
	afterEach(async function() {
		//await driver.quit();
	});
	it('OTP', async function() {
// Test name: OTP
		// Step # | name | target | value
		// 1 | open | login | 
		await driver.get(logInPage);
		await sleep(4000);
		// 2 | setWindowSize | 1295x687 | 
		await driver.manage().window().maximize();
		// 3 | click | name=email | 
		await driver.findElement(By.name('email')).click();
		await sleep(4000);
		// 4 | type | name=password | Holla2021!
		await driver.findElement(By.name('password')).sendKeys(passWord);
		await sleep(4000);
		// 5 | type | name=email | alicebitholla@gmail.com
		await driver.findElement(By.name('email')).sendKeys(userName);
		await sleep(4000);
		// 6 | click | name=password | 
		// 7 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 8 | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container | 
		await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
		await sleep(4000);
		// 9 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | 
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		// 10 | click | css=.otp_secret | 
		await sleep(4000);
		await driver.findElement(By.css('.otp_secret')).click();
		// 11 | storeText | css=.otp_secret | code
		let code = vars['code'] = await driver.findElement(By.css('.otp_secret')).getText();
		// 12 | echo | ${code} | 
		let token = totp(code);

 
		console.log(code);
		console.log(token); 
		// 13 | click | name=code | 
		await driver.findElement(By.name('code')).click();
		// 14 | type | name=code | ssssss
		await driver.findElement(By.name('code')).sendKeys(token);
		// 15 | mouseOver | css=form | 
		await sleep(4000);
		{
			const element = await driver.findElement(By.css('form'));
			await driver.executeScript('arguments[0].scrollIntoView(true);', element);
		}
		await driver.findElement(By.css('form')).click();
		console.log('ready for srcowload');
      
		await sleep(4000);
		// 35 | click | css=.success_display-wrapper | 
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);
		// 36 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully activated 2FA');
		// 37 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 9 | click | css=.tab_item:nth-child(2) > div | 
		await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
		await sleep(4000);
		// 10 | click | name=old_password | 
		await driver.findElement(By.name('old_password')).click();
		// 11 | type | name=old_password | !
		await driver.findElement(By.name('old_password')).sendKeys(passWord);
		// 12 | type | name=new_password | !changed
		await driver.findElement(By.name('new_password')).sendKeys(newPass);
		// 13 | click | name=new_password_confirm | 
		await driver.findElement(By.name('new_password_confirm')).click();
		// 14 | type | name=new_password_confirm | Holla2021!changed
		await driver.findElement(By.name('new_password_confirm')).sendKeys(newPass);
		// 15 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		// 36 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully changed your password');
		// 37 | click | css=.holla-button | 
		await driver.findElement(By.css('.success_display-wrapper > .holla-button')).click();
		await sleep(4000);
		// 16 | click | css=.tab_item:nth-child(3) > div | 
		await driver.findElement(By.css('.tab_item:nth-child(3) > div')).click();
		await sleep(4000);
		// 17 | click | css=.mb-4 > .edit-wrapper__container | 
		await driver.findElement(By.css('.mb-4 > .edit-wrapper__container')).click();
		await sleep(4000);
		// 18 | click | name=name | 
		await driver.findElement(By.name('name')).click();
		// 19 | type | name=name | test
		await driver.findElement(By.name('name')).sendKeys('test');
		// 20 | click | css=.w-50:nth-child(3) > .holla-button | 
		await driver.findElement(By.css('.w-50:nth-child(3) > .holla-button')).click();
		await sleep(4000);
		// 21 | type | name=otp_code | 369391
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		// 22 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 23 | assertText | css=.popup_info-title > .edit-wrapper__container | Copy your API Key
		assert(await driver.findElement(By.css('.popup_info-title > .edit-wrapper__container')).getText() == 'Copy your API Key');
		// 24 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await driver.findElement(By.css('.tab_item:nth-child(1) > div')).click();
		// 26 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | 
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		// 27 | type | name=otp_code | 37328
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		// 28 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 29 | click | css=.success_display-wrapper | 
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);
		// 30 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully deactivated 2FA
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully deactivated 2FA');
		// 31 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
	});
  it('re OTP', async function() {
// Test name: OTP
		// Step # | name | target | value
		// 1 | open | login | 
		await driver.get(logInPage);
		await sleep(4000);
		// 2 | setWindowSize | 1295x687 | 
		await driver.manage().window().maximize();
		// 3 | click | name=email | 
		await driver.findElement(By.name('email')).click();
		await sleep(4000);
		// 4 | type | name=password | Holla2021!
		await driver.findElement(By.name('password')).sendKeys(newPass);
		await sleep(4000);
		// 5 | type | name=email | alicebitholla@gmail.com
		await driver.findElement(By.name('email')).sendKeys(userName);
		await sleep(4000);
		// 6 | click | name=password | 
		// 7 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 8 | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container | 
		await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
		await sleep(4000);
		// 9 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | 
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		// 10 | click | css=.otp_secret | 
		await sleep(4000);
		await driver.findElement(By.css('.otp_secret')).click();
		// 11 | storeText | css=.otp_secret | code
		let code = vars['code'] = await driver.findElement(By.css('.otp_secret')).getText();
		// 12 | echo | ${code} | 
		let token = totp(code);

 
		console.log(code);
		console.log(token); 
		// 13 | click | name=code | 
		await driver.findElement(By.name('code')).click();
		// 14 | type | name=code | ssssss
		await driver.findElement(By.name('code')).sendKeys(token);
		// 15 | mouseOver | css=form | 
		await sleep(4000);
		{
			const element = await driver.findElement(By.css('form'));
			await driver.executeScript('arguments[0].scrollIntoView(true);', element);
		}
		await driver.findElement(By.css('form')).click();
		console.log('ready for srcowload');
      
		await sleep(4000);
		// 35 | click | css=.success_display-wrapper | 
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);
		// 36 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully activated 2FA');
		// 37 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 9 | click | css=.tab_item:nth-child(2) > div | 
		await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
		await sleep(4000);
		// 10 | click | name=old_password | 
		await driver.findElement(By.name('old_password')).click();
		// 11 | type | name=old_password | !
		await driver.findElement(By.name('old_password')).sendKeys(newPass);
		// 12 | type | name=new_password | !changed
		await driver.findElement(By.name('new_password')).sendKeys(passWord);
		// 13 | click | name=new_password_confirm | 
		await driver.findElement(By.name('new_password_confirm')).click();
		// 14 | type | name=new_password_confirm | Holla2021!changed
		await driver.findElement(By.name('new_password_confirm')).sendKeys(passWord);
		// 15 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		// 36 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully changed your password');
		// 37 | click | css=.holla-button | 
		await driver.findElement(By.css('.success_display-wrapper > .holla-button')).click();
		await sleep(4000);
		// 16 | click | css=.tab_item:nth-child(3) > div | 
		await driver.findElement(By.css('.tab_item:nth-child(3) > div')).click();
		await sleep(4000);
		// 17 | click | css=.mb-4 > .edit-wrapper__container | 
		await driver.findElement(By.css('.mb-4 > .edit-wrapper__container')).click();
		await sleep(4000);
		// 18 | click | name=name | 
		await driver.findElement(By.name('name')).click();
		// 19 | type | name=name | test
		await driver.findElement(By.name('name')).sendKeys('test');
		// 20 | click | css=.w-50:nth-child(3) > .holla-button | 
		await driver.findElement(By.css('.w-50:nth-child(3) > .holla-button')).click();
		await sleep(4000);
		// 21 | type | name=otp_code | 369391
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		// 22 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 23 | assertText | css=.popup_info-title > .edit-wrapper__container | Copy your API Key
		assert(await driver.findElement(By.css('.popup_info-title > .edit-wrapper__container')).getText() == 'Copy your API Key');
		// 24 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await driver.findElement(By.css('.tab_item:nth-child(1) > div')).click();
		// 26 | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | 
		await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		// 27 | type | name=otp_code | 37328
		token = totp(code);
		await driver.findElement(By.name('otp_code')).sendKeys(token);
		// 28 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		// 29 | click | css=.success_display-wrapper | 
		await driver.findElement(By.css('.success_display-wrapper')).click();
		await sleep(4000);
		// 30 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully deactivated 2FA
		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully deactivated 2FA');
		// 31 | click | css=.holla-button | 
		await driver.findElement(By.css('.holla-button')).click();
	});
});
