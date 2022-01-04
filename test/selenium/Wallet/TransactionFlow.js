//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function TransactionFlow(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	const path = require('path');
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('../Utils/Utils.js');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
	let bob = process.env.BOB;
	let passWord = process.env.PASSWORD;
	let alice = process.env.ALICE;
	let logInPage = process.env.LOGIN_PAGE;
	let admin = process.env.EMAIL_ADMIN_USERNAME;
	let emailPass = process.env.EMAIL_PASS;
	let browser = process.env.BROWSER;
    let step = util.getStep()
	describe('Internal D/W Flow', function() {
		this.timeout(300000);
		let driver;
		vars = {};
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		} 
		async function waitForWindow(timeout = 2) {
			await driver.sleep(timeout);
			const handlesThen = vars['windowHandles'];
			const handlesNow = await driver.getAllWindowHandles();
			if (handlesNow.length > handlesThen.length) {
				return handlesNow.find(handle => (!handlesThen.includes(handle)));
			}
			throw new Error('New window did not appear before timeout');
		}
		beforeEach(async function() {
			driver = await new Builder().forBrowser(browser).build();
			
			driver.manage().window().maximize();
			let step = util.getStep()
		});
		afterEach(async function() {
		    util.setStep()
		//	await driver.quit();
		});
		it('BobLoginFirstTime', async function() {
			console.log(' Test name: BobLogIn');
			console.log(' Step # | action | target | value');
			console.log(step++,' | open |'+ logInPage + '| ');
			await driver.get(logInPage);
			driver.manage().window().maximize();
			await driver.sleep(5000);
    
			console.log(step++,' | type | name=email | bob@gmail.com');
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).sendKeys(bob);
    
			console.log(step++,' | type | name=password | Holla!');
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
		
			console.log(step++,' | click | css=.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container | ');
			await driver.findElement(By.css('.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container')).click();
		
			console.log(step++,' | click | name=search-assets | ');
			await driver.findElement(By.name('search-assets')).click();
		
			console.log(step++,' | type | name=search-assets | hollaex');
			await driver.findElement(By.name('search-assets')).sendKeys('hollaex');
		
			console.log(step++,' | sendKeys | name=search-assets | ${KEY_ENTER}');
			await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
			console.log(step++,' | click | css=.td-amount > .d-flex | ');
			await driver.findElement(By.linkText('HollaEx')).click()
		
			console.log(step++,' | storeText | css=.with_price-block_amount-value | before');
			vars['before'] = await driver.findElement(By.css('.with_price-block_amount-value')).getText()
			console.log("before:")
			console.log(vars['before'])

			console.log('This is the EndOfTest');
		});
		it('From Alice to Bob', async function() {
			console.log("before:")
			console.log(vars['before'])

			console.log(' Test name: BobLogIn');
			console.log(' Step # | action | target | value');
			console.log(step++,' | open | '+ logInPage + '| ');
			await driver.get(logInPage);
			await driver.sleep(5000);
			;	
    	console.log(step++,' | type | name=email | alice');
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).sendKeys(alice);
    
			console.log(step++,' | type | name=password | Holla!');
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
   
			console.log(step++,' | click | css=.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container | ');
			await driver.findElement(By.css('.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container')).click();
		
			console.log(step++,' | click | name=search-assets | ');
			await driver.findElement(By.name('search-assets')).click();
		
			console.log(step++,' | type | name=search-assets | Hollaex');
			await driver.findElement(By.name('search-assets')).sendKeys('Hollaex');
		
			console.log(step++,' | sendKeys | name=search-assets | ${KEY_ENTER}');
			await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
			console.log(step++,' | click | css=.csv-action:nth-child(2) > .action_notification-text | ');
			await driver.findElement(By.css('.csv-action:nth-child(2) > .action_notification-text')).click();
		
			console.log(step++,' | click | name=address | ');
			await driver.findElement(By.name('address')).click();
		
			console.log(step++,' | type | name=address | 0xe8a3b3a9d72b7b4d7e2f0ae33b23e36fcabfd88f');
			await driver.findElement(By.name('address')).sendKeys('0xe8a3b3a9d72b7b4d7e2f0ae33b23e36fcabfd88f');
			
		
			console.log(step++,' | click | css=.with-notification .field-label-wrapper:nth-child(1) | ');
			await driver.findElement(By.css('.with-notification .field-label-wrapper:nth-child(1)')).click();
		
			console.log(step++,' | click | name=amount | ');
			await driver.findElement(By.name('amount')).click();
		
			console.log(step++,' | type | name=amount | 1');
			await driver.findElement(By.name('amount')).sendKeys('0.0001');
		
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
		
			console.log(step++,' | click | css=.button-fail | ');
			await driver.findElement(By.css('.button-fail')).click();
		
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
		
			console.log(step++,' | click | css=.button-success | ');
			await driver.findElement(By.css('.button-success')).click();
			await sleep(2000);
		
			console.log(step++,' | assertText | css=.d-flex > .icon_title-wrapper .icon_title-text | Confirm Via Email');
			assert(await driver.findElement(By.css('.d-flex > .icon_title-wrapper .icon_title-text')).getText() == 'Confirm Via Email');
		
			console.log(step++,' | click | css=.holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.holla-button:nth-child(3)')).click();

			console.log('This is the EndOfTest');
		});
  
		it('CheckMail', async function() {

			console.log('Test name: Confirmation');
			console.log('Step # | name | target | value');
			await util.emailLogIn(step,driver,admin,emailPass);
		
			console.log(step++,' | Click | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
			await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
		
			console.log(step++,' | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
			{
				const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
				await driver.actions({ bridge: true}).doubleClick(element).perform();
			}
		
			console.log(step++,'  | selectFrame | index=1 | ');
			await driver.switchTo().frame(1);
			await sleep(5000);
		
			console.log(step++,' | storeText | xpath=/html/body/pre/a[22] | content');
			vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[22]')).getText();
			const emailCont = await driver.findElement(By.css('pre')).getText();
		
			console.log(step++,' | echo | ${content} | ');
			console.log(vars['content']);
		
			console.log(step++,' | assertText | xpath=/html/body/pre/a[22] | ${content}');
			expect(vars['content']).to.equal(alice.toLowerCase());
     
			console.log(step++,' | storeAttribute | xpath=/html/body/pre/a[26]@href | mytextlink');
			{
				const attribute = await driver.findElement(By.xpath('/html/body/pre/a[23]')).getAttribute('href');
				vars['mytextlink'] = attribute;
			}
		
			console.log(step++,' | echo | ${mytextlink} | ');
			console.log(vars['mytextlink']);
			console.log(step++,' | echo | \'xpath=/html/body/pre/a[23]\' | ');
			console.log('\'xpath=/html/body/pre/a[23]\'');
			console.log(step++,' | open | ${mytextlink} | ');
		
			const completedLink = await util.addRest(emailCont,vars['mytextlink']);
			await console.log(completedLink);
			await driver.get(completedLink);
			await sleep(10000);

			console.log(step++,' | click | css=.icon_title-wrapper | ');
			await driver.findElement(By.css('.icon_title-wrapper')).click();
		
			console.log(step++,' | assertNotText | css=.icon_title-text | Error');
			assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success');
		
			console.log('This is the EndOfTest');
		});
	
		it('BobLoginSecondTime', async function() {

			console.log(' Test name: BobLogIn');
			console.log(' Step # | action | target | value');
		
			console.log(step++,' | open | ' + logInPage + '| ');
			await driver.get(logInPage);
			driver.manage().window().maximize();
			await driver.sleep(5000);
		   
			console.log(step++,' | type | name=email | bob@gmail.com');
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).sendKeys(bob);
    
			console.log(step++,' | type | name=password | Holla!');
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

			console.log(step++,' | click | css=.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container | ');
			await driver.findElement(By.css('.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container')).click();
		
			console.log(step++,' | click | name=search-assets | ');
			await driver.findElement(By.name('search-assets')).click();
		
			console.log(step++,' | type | name=search-assets | hollaex');
			await driver.findElement(By.name('search-assets')).sendKeys('hollaex');
			await sleep(2000);

			console.log(step++,' | sendKeys | name=search-assets | ${KEY_ENTER}');
			await driver.findElement(By.name('search-assets')).sendKeys(Key.ENTER);
		
			console.log(step++,' | click | css=.td-amount > .d-flex | ');
			await driver.findElement(By.linkText('HollaEx')).click()
	
					console.log(step++,' | storeText | css=.with_price-block_amount-value | before');
			vars['after'] = await driver.findElement(By.css('.with_price-block_amount-value')).getText()
			let diff = (parseFloat(vars['after']).toFixed(4)- (parseFloat(vars['before'])).toFixed(4))
			expect(diff).to.equal(0.0001);

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
//	TransactionFlow();
})
module.exports = {
	TransactionFlow
};