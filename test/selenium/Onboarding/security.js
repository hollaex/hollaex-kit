async function Security(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const totp = require('totp-generator');
	const path = require('path')
	const { expect } = require('chai');
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
	//let userName =  util.getNewUser();
	let passWord = process.env.PASSWORD;
	let newPass = process.env.NEWPASS;
	let logInPage = process.env.LOGIN_PAGE;
	let emailAdmin =process.env.Email_ADMIN_USERNAME;
	let apiUrl = process.env.API_WEBSITE;
	let emailPassword = process.env.PASSWORD;
	let step = util.getStep();
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
			driver.manage().window().maximize();
			let step = util.getStep()
		});

		afterEach(async function() {
			util.setStep(step);
			await driver.quit();
		});
		it('OTP', async function() {
			console.log ('  Test name: OTP');
			console.log ('  Step # | name | target | value ');
		
			console.log(step++,'  | open | login | ');
			await driver.get(logInPage);
			await sleep(4000);
					
			console.log(step++,'  | click | name=email | ');
			await driver.findElement(By.name('email')).click();
			await sleep(4000);

			console.log(step++,'  | type | name=password | password');
			await driver.findElement(By.name('password')).sendKeys(passWord);
			await sleep(4000);
			console.log(step++,'  | type | name=email | '+userName);
			await driver.findElement(By.name('email')).sendKeys(userName);
			await sleep(4000);
		
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);

			console.log(step++,'  | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container | ');
			await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | ');
			await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		
			console.log(step++,'  | click | css=.otp_secret | ');
			await sleep(4000);

			await driver.findElement(By.css('.otp_secret')).click();
			console.log(step++,'  | storeText | css=.otp_secret | code');
			let code = vars['code'] = await driver.findElement(By.css('.otp_secret')).getText();
		
			console.log(step++,'  | echo | ${code} | ');
			let token = totp(code);
			console.log(code);
			console.log(token); 
		
			console.log(step++,'  | click | name=code | ');
			await driver.findElement(By.name('code')).click();
		
			console.log(step++,'  | type | name=code | token');
			await driver.findElement(By.name('code')).sendKeys(token);
			await sleep(4000);
		
			console.log(step++,'  | mouseOver | css=form | ');
			{
				const element = await driver.findElement(By.css('form'));
				await driver.executeScript('arguments[0].scrollIntoView(true);', element);
			}
			await sleep(4000);
		
			console.log(step++,'  | click | css=form |')
			await driver.findElement(By.css('form')).click();
			await sleep(4000);
			
			console.log(step++,'  | click | xpath/div[5]/div/div/div[2]/div[4]/form/button | ');
			await driver.findElement(By.xpath('//div[5]/div/div/div[2]/div[4]/form/button')).click();
			await sleep(4000);

			console.log ('  16 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA');
			assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully activated 2FA');
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);

			console.log(step++,'   | click | css=.tab_item:nth-child(2) > div | ');
			await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | name=old_password | ');
			await driver.findElement(By.name('old_password')).click();
		
			console.log(step++,'  | type | name=old_password | password ');
			await driver.findElement(By.name('old_password')).sendKeys(passWord);
		
			console.log(step++,'  | type | name=new_password | !changed');
			await driver.findElement(By.name('new_password')).sendKeys(newPass);
		
			console.log(step++,'  | click | name=new_password_confirm | ');
			await driver.findElement(By.name('new_password_confirm')).click();
		
			console.log(step++,'  | type | name=new_password_confirm | !changed');
			await driver.findElement(By.name('new_password_confirm')).sendKeys(newPass);
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log ('  16 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA');
			assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'An email is sent to you to authorize the password change.');
			//The message was 'You have successfully changed your password' in kit 2.1

			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.success_display-wrapper > .holla-button')).click();
			await sleep(4000);

			console.log(step++,'   | click | css=.tab_item:nth-child(3) > div | ');
			await driver.findElement(By.css('.tab_item:nth-child(3) > div')).click();
			await sleep(4000);

			console.log(step++,'   | click | css=.mb-4 > .edit-wrapper__container | ');
			await driver.findElement(By.css('.mb-4 > .edit-wrapper__container')).click();
		
			await sleep(4000);
			console.log(step++,'  | click | name=name | ');
			await driver.findElement(By.name('name')).click();

			console.log(step++,'  | type | name=name | test');
			await driver.findElement(By.name('name')).sendKeys('test');
		
			console.log(step++,'   | click | css=.w-50:nth-child(3) > .holla-button | ');
			await driver.findElement(By.css('.w-50:nth-child(3) > .holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | type | name=otp_code | code');
			token = totp(code);
			await driver.findElement(By.name('otp_code')).sendKeys(token);
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | assertText | css=.popup_info-title > .edit-wrapper__container | Copy your API Key');
			assert(await driver.findElement(By.css('.popup_info-title > .edit-wrapper__container')).getText() == 'Copy your API Key');
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await driver.findElement(By.css('.tab_item:nth-child(1) > div')).click();
		
			console.log(step++,'  | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container | ');
			await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		
			console.log(step++,'  | type | name=otp_code | code');
			token = totp(code);
			await driver.findElement(By.name('otp_code')).sendKeys(token);
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.success_display-wrapper | ');
			await driver.findElement(By.css('.success_display-wrapper')).click();
			await sleep(4000);

			console.log(step++,'  | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully deactivated 2FA');
			assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully deactivated 2FA');
		
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();

			console.log('This is the EndOfTest');

		});
		it('Email Confirmation', async function() {
			console.log('Test name: Confirmation');
			console.log('Step # | name | target | value');
			await util.emailLogIn(driver,emailAdmin,emailPassword);
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
			await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
			
			console.log(step++,'   | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
			{
				const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
				await driver.actions({ bridge: true}).doubleClick(element).perform();
			}
			
			console.log(step++,'   | selectFrame | index=1 | ');
			await driver.switchTo().frame(1);
			await sleep(10000);
			
			console.log(step++,'   | storeText | xpath=/html/body/pre/a[16] | content');
			vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[16]')).getText();
			const emailCont = await driver.findElement(By.xpath('/html/body/pre')).getText();
		
			console.log(step++,'  | echo | ${content} | ');
			console.log('6 | assertText | xpath=/html/body/pre/a[16] | ${content}');
			expect(vars['content']).to.equal(userName.toLowerCase());
	
			console.log(step++,'   | storeAttribute | yourwebsite/v2/confirm-change-password | mytextlink');
			{
				const attribute = apiUrl+'confirm-change-password'
				vars['mytextlink'] = attribute;
			}
			console.log(step++,'  | echo | ${mytextlink} | ');
			console.log(vars['mytextlink']);
			
			console.log(step++,'  |link starts with'+ apiUrl+'confirm-change-password');
			console.log(apiUrl+'confirm-change-password');
			
			console.log(step++,'  | open | ${mytextlink} | ');
			const completedLink = await util.addRest(emailCont,vars['mytextlink']);
			await console.log(completedLink);
			await driver.get(completedLink);
			await sleep(10000);
			
			console.log(step++,'  | selectFrame | relative=parent | ');
			await driver.findElement(By.css('.icon_title-wrapper')).click()
			
			console.log(step++,'  | assertText | css=.icon_title-text | Success');
			assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success')
		});
		it('Re_OTP', async function() {
			console.log ('  Test name: OTP ');
			console.log ('  Step # | name | target | value ');
		
			console.log(step++,'  | open | login |  ');
			await driver.get(logInPage);
			await sleep(4000);

			console.log(step++,'  | click | name=email |  ');
			await driver.findElement(By.name('email')).click();
			await sleep(4000);

			console.log(step++,'  | type | name=password | password ');
			await driver.findElement(By.name('password')).sendKeys(newPass);
			await sleep(4000);

			console.log(step++,'   | type | name=email | '+userName );
			await driver.findElement(By.name('email')).sendKeys(userName);
			await sleep(4000);
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'   | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container |  ');
			await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container |  ');
			await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
			await sleep(4000);

			console.log(step++,'  | click | css=.otp_secret |  ');
			await driver.findElement(By.css('.otp_secret')).click();
		
			console.log(step++,'  | storeText | css=.otp_secret | code ');
			let code = vars['code'] = await driver.findElement(By.css('.otp_secret')).getText();
		
			console.log(step++,'  | echo | ${code} |  ');
			let token = totp(code);
			console.log(code);
			console.log(token); 
		
			console.log(step++,'  | click | name=code |  ');
			await driver.findElement(By.name('code')).click();
		
			console.log(step++,'  | type | name=code | token ');
			await driver.findElement(By.name('code')).sendKeys(token);
			await sleep(4000)

			console.log(step++,'  | mouseOver | css=form |  ');
			{
				const element = await driver.findElement(By.css('form'));
				await driver.executeScript('arguments[0].scrollIntoView(true);', element);
			}
			await sleep(4000)
			{
				console.log(step++,'  | click| css=form |  ');
				await driver.findElement(By.css('form')).click();
				await sleep(4000);
			}
			console.log(step++,'  | click | css=.success_display-wrapper |  ');
			await driver.findElement(By.css('.success_display-wrapper')).click();
			await sleep(4000);
		
			console.log ('  15 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA ');
			assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully activated 2FA');
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);

			console.log(step++,'   | click | css=.tab_item:nth-child(2) > div |  ');
			await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
			await sleep(4000);

			console.log(step++,'  | click | name=old_password |  ');
			await driver.findElement(By.name('old_password')).click();
		
			console.log(step++,'  | type | name=old_password | password ');
			await driver.findElement(By.name('old_password')).sendKeys(newPass);
		
			console.log(step++,'  | type | name=new_password | !changed ');
			await driver.findElement(By.name('new_password')).sendKeys(passWord);
		
			console.log(step++,'  | click | name=new_password_confirm |  ');
			await driver.findElement(By.name('new_password_confirm')).click();

			console.log(step++,'  | type | name=new_password_confirm | !changed ');
			await driver.findElement(By.name('new_password_confirm')).sendKeys(passWord);
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log ('  24 | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully activated 2FA ');
			assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully changed your password');
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.success_display-wrapper > .holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'   | click | css=.tab_item:nth-child(3) > div |  ');
			await driver.findElement(By.css('.tab_item:nth-child(3) > div')).click();
			await sleep(4000);
		
			console.log(step++,'   | click | css=.mb-4 > .edit-wrapper__container |  ');
			await driver.findElement(By.css('.mb-4 > .edit-wrapper__container')).click();
			await sleep(4000);

			console.log(step++,'  | click | name=name |  ');
			await driver.findElement(By.name('name')).click();
		
			console.log(step++,'  | type | name=name | test ');
			await driver.findElement(By.name('name')).sendKeys('test');
		
			console.log(step++,'  | click | css=.w-50:nth-child(3) > .holla-button |  ');
			await driver.findElement(By.css('.w-50:nth-child(3) > .holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | type | name=otp_code | code ');
			token = totp(code);
			await driver.findElement(By.name('otp_code')).sendKeys(token);
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);

			console.log(step++,'  | assertText | css=.popup_info-title > .edit-wrapper__container | Copy your API Key ');
			assert(await driver.findElement(By.css('.popup_info-title > .edit-wrapper__container')).getText() == 'Copy your API Key');
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();
			await driver.findElement(By.css('.tab_item:nth-child(1) > div')).click();
		
			console.log(step++,'  | click | css=.checkbutton-input-wrapper--label > .edit-wrapper__container |  ');
			await driver.findElement(By.css('.checkbutton-input-wrapper--label > .edit-wrapper__container')).click();
		
			console.log(step++,'  | type | name=otp_code | code ');
			token = totp(code);
			await driver.findElement(By.name('otp_code')).sendKeys(token);
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.success_display-wrapper | ');
			await driver.findElement(By.css('.success_display-wrapper')).click();
			await sleep(4000);

			console.log(step++,'  | assertText | css=.success_display-content-text > .edit-wrapper__container | You have successfully deactivated 2FA ');
			assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully deactivated 2FA');
		
			console.log(step++,'  | click | css=.holla-button |  ');
			await driver.findElement(By.css('.holla-button')).click();

			console.log('This is the EndOfTest');
		});
		it('Email Confirmation', async function() {
			console.log('Test name: Confirmation');
			console.log('Step # | name | target | value');
			await util.emailLogIn(driver,emailAdmin,emailPassword);
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
			await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
			
			console.log(step++,'   | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
			{
				const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
				await driver.actions({ bridge: true}).doubleClick(element).perform();
			}
			
			console.log(step++,'   | selectFrame | index=1 | ');
			await driver.switchTo().frame(1);
			await sleep(10000);
			
			console.log(step++,'  | storeText | xpath=/html/body/pre/a[16] | content');
			vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[16]')).getText();
			const emailCont = await driver.findElement(By.xpath('/html/body/pre')).getText();
		
			console.log(step++,'  | echo | ${content} | ');
			console.log(step++,'  | assertText | xpath=/html/body/pre/a[16] | ${content}');
			expect(vars['content']).to.equal(userName.toLowerCase());
	
			console.log(step++,'  | storeAttribute | yourwebsite/v2/confirm-change-password | mytextlink');
			{
				const attribute = apiUrl+'confirm-change-password'
				vars['mytextlink'] = attribute;
			}
			console.log(step++,'  | echo | ${mytextlink} | ');
			console.log(vars['mytextlink']);
			
			console.log(step++,'   |link starts with '+ apiUrl+'confirm-change-password');
			console.log(apiUrl+'confirm-change-password');
			
			console.log(step++,'  | open | ${mytextlink} | ');
			const completedLink = await util.addRest(emailCont,vars['mytextlink']);
			await console.log(completedLink);
			await driver.get(completedLink);
			await sleep(10000);
			
			console.log(step++,'  | selectFrame | relative=parent | ');
			await driver.findElement(By.css('.icon_title-wrapper')).click()
			
			console.log(step++,'  | assertText | css=.icon_title-text | Success');
			assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success')
		});
	});
}
describe('Main Test', function () {
 
	//Security();
})
module.exports.Security = Security;