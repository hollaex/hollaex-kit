//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function Promotion(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	const path = require('path')
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('./../Utils/Utils.js');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
	let userName = process.env.ADMIN_USER;
	let passWord = process.env.ADMIN_PASS;
	let logInPage = process.env.LOGIN_PAGE;
	let website = process.env.WEBSITE;
	let username = process.env.LEVEL_NAME;
	let password = process.env.PASSWORD;
	const timestamp = require('time-stamp');
	let step = util.getStep();

	
	const fs = require('fs');
	// const myConsole = new console.Console(fs.createWriteStream(logPath+'/log.txt'));
	// myConsole.log('hello world');
//  function log(message) {
// 		console.log(message);
// 		fs.writeFile(logPath+'/log.txt',message);
// 	 }
	
	describe('Trade', function() {
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

		it('Promotion', async function() {
	
		
			console.log(' Test name: promo ');
			console.log(' Step # | name | target | value');
		
			console.log(step++,'  | open | https//website/account | ');
			console.log(step++,'  | click | css=a > .pl-1 | ');
			// log(' 1 | open | https//website/account | ');
			// log(' 2 | click | css=a > .pl-1 | ');
			await driver.findElement(By.css('a > .pl-1')).click();
			await sleep(3000);
		
			console.log(step++,'  | click | linkText=Users | ');
			await driver.findElement(By.linkText('Users')).click();
			await sleep(3000);
		
			console.log(step++,'   | type | name=input | leveltest@testsae.com');
			await driver.findElement(By.name('input')).sendKeys('leveltest@testsae.com');
			await sleep(3000);
		
			console.log(step++,'  | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
			await sleep(5000);
			
			console.log(step++,'  | click | xpath=//*[@id="rc-tabs-2-panel-about"]/div/div/div[1]/div/div[1]/div[1]/div[2]| ');
			await driver.findElement(By.xpath('//*[@id="rc-tabs-2-panel-about"]/div/div/div[1]/div/div[1]/div[1]/div[2]')).click();
			await sleep(5000);
			
		
			console.log(step++,'  | click | id=user-discount-form_feeDiscount | ');
			await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
			await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Key.BACK_SPACE);
			await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Key.BACK_SPACE);
			await sleep(3000);

			console.log(step++,'  | type | id=user-discount-form_feeDiscount | 13');
			await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Math.floor(Math.random() * 100));
		
			console.log(step++,'  | click | css=.w-100 | ');
			await driver.findElement(By.css('.w-100')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.mt-2 | ');
			await driver.findElement(By.css('.mt-2')).click();
			await sleep(4000);
		
			console.log(step++,'  | storeText | css=.mt-2 | perc');
  		    vars['perc'] = await driver.findElement(By.css('.mt-2')).getText();
		
		    util.hollatimestamp();
			console.log('Timestamp : '+String(util.getHollatimestamp()));
			util.setPromotionRate(vars['perc']);
			console.log(String(util.getPromotionRate()));
		
			console.log(step++,'   | click | css=.ant-btn-primary:nth-child(2) > span | ');
			await driver.findElement(By.css('.ant-btn-primary:nth-child(2) > span')).click();
			await sleep(4000);
		
			console.log(step++,'  | click | css=.ant-message-notice-content | ');
			// await driver.findElement(By.css(".ant-message-notice-content")).click()
		
			console.log(step++,'  | click | css=.active-side-menu | ');
			await driver.findElement(By.css('.active-side-menu')).click();
			await sleep(4000);
		
			console.log(step++,'  | type | name=input | leveltest@testsae.com');
			await driver.findElement(By.name('input')).sendKeys('leveltest@testsae.com');
			await sleep(5000);
			
			console.log(step++,'  | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
			await sleep(5000);
		
			console.log(step++,'   | click | xpath=//*[@id="rc-tabs-5-panel-about"]/div/div/div[1]/div/div[1]/div[1]/div[2]| ');
			await driver.findElement(By.xpath('//*[@id="rc-tabs-5-panel-about"]/div/div/div[1]/div/div[1]/div[1]/div[2]')).click();
			await sleep(5000);
			
			console.log(step++,'   | click | id=user-discount-form_feeDiscount | ');
			await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
		
			console.log(step++,'  | storeValue | id=user-discount-form_feeDiscount | value');
			vars['value'] = await driver.findElement(By.id('user-discount-form_feeDiscount')).getAttribute('value');
			
			{
				console.log(step++,' | click | id=user-discount-form_feeDiscount | ');
				await driver.findElement(By.id('user-discount-form_feeDiscount')).click();
				await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Key.BACK_SPACE);
				await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys(Key.BACK_SPACE);
				await sleep(3000);
					
				console.log(step++,' | type | id=user-discount-form_feeDiscount | 13');
				await driver.findElement(By.id('user-discount-form_feeDiscount')).sendKeys((Math.floor(Math.random() * 100)+100));	
				assert(await driver.findElement(By.xpath('//*[@id="user-discount-form"]/div[3]/div[2]/div/div[2]/div')).getText() == 'Value must be between 0 to 100');
			}
			console.log(step++,'  | click | css=.ant-modal-close-x | ');
			//console.log(vars['value'] );
			await driver.findElement(By.css('.ant-modal-close-x')).click();
		
			console.log(step++,'  | click | css=.top-box-menu:nth-child(1) | ');
			await driver.findElement(By.css('.top-box-menu:nth-child(1)')).click();
		
			console.log(step++,'  | click | xpath=//*[@id="trade-nav-container"]/div[3]/div[2]) | ');
			await driver.findElement(By.xpath('//*[@id="trade-nav-container"]/div[3]/div[2]')).click();
		
			console.log(step++,'   | click | xpath=//*[@id="tab-account-menu"]/div[11]/div[3] | ');
			await driver.findElement(By.xpath('//*[@id="tab-account-menu"]/div[11]/div[3]')).click();
			await sleep(5000);

			console.log(step++,'  | click | name=email | ');
			await driver.findElement(By.name('email')).click();
			
			console.log('one day waiting ');
			//'await sleep(86400000)
		
			console.log(step++,'  | type | name=email | username');
			await driver.findElement(By.name('email')).sendKeys(username);
			
			console.log(step++,'  | type | name=password | password');
			await driver.findElement(By.name('password')).sendKeys(password);
			
			console.log(step++,'  | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			
			console.log(step++,'   | runScript | window.scrollTo(0,840) | ');
			await driver.executeScript('window.scrollTo(0,840)');
			await sleep(5000);
			const diffInMilliseconds = Math.abs(new Date(timestamp('YYYY/MM/DD HH:mm:ss')) - new Date(util.getHollatimestamp()));

			console.log(diffInMilliseconds); //'86400000
			if (diffInMilliseconds >= 8.64e+7){
				console.log(diffInMilliseconds);
			}else {
				console.log('less than one day');
			}
		
			console.log(step++,'  | click | css=.trade-account-secondary-txt > .d-flex > div:nth-child(2) | ');
			await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).click();
			await sleep(2000);

			console.log(step++,'  | assertText | css=.trade-account-secondary-txt > .d-flex > div:nth-child(2) | ${}');
			console.log(' Fee reduction: ');
			console.log(await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).getText());
			console.log(String(util.getPromotionRate()));
			assert(await driver.findElement(By.css('.trade-account-secondary-txt > .d-flex > div:nth-child(2)')).getText() == String(util.getPromotionRate().replace('discount:','reduction:')));
		
			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	//Promotion();
})
module.exports.Promotion = Promotion;