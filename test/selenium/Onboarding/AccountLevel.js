// Account level
async function AccountLevel () {
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
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
	require('dotenv').config({ path: path.resolve(__dirname, './../.env') });
	let userName = process.env.ADMIN_USER;
	let username = process.env.LEVEL_NAME;
	let password = process.env.ADMIN_PASS;
	let passWord = process.env.PASSWORD;
	let logInPage = process.env.LOGIN_PAGE;
	let Website = process.env.WEBSITE;
	let step = util.getStep();
	util.logHolla(logPath)


	describe('AccountLevel', function() {
		this.timeout(3000000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}
		beforeEach(async function() {
			driver = await new Builder().forBrowser('chrome').build();
			driver.manage().window().maximize();
			vars = {};
		});
		afterEach(async function() {
		//await driver.quit();
		});
		it('Account Level', async function() {
			console.log('Supervisor can access all deposit, withdrawals and approval settings');
			console.log(' Test name: Supervisor');
			console.log(' Step # | name | target | value');
		
			console.log(step++,' | open | /login | ');
			await driver.get(logInPage);
			await sleep(5000);
		
			console.log(step++,' | echo | \'Supervisor can access all deposit, withdrawals and approval settings\' |'); 
			console.log('\'Supervisor can access all deposit, withdrawals and approval settings\'');
		
			console.log(step++,' | type | name=email |'+userName);
			await driver.findElement(By.name('email')).sendKeys(userName);
		
			console.log(step++,' | type | name=password | password');
			await driver.findElement(By.name('password')).sendKeys(password);
		
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(10000);

			console.log(step++,' | click | css=a > .pl-1 | ');
			await driver.findElement(By.css('a > .pl-1')).click();
			await sleep(5000);

			console.log(step++,' | click | linkText=Users | ');
			await driver.findElement(By.linkText('Users')).click();
			await sleep(3000);
		
			console.log(step++,' | click | name=input | ');
			await driver.findElement(By.name('input')).click();
			await sleep(3000);
		
			console.log(step++,' | type | name=input | leveltest');
			await driver.findElement(By.name('input')).sendKeys('leveltest');
		
			console.log(step++,' | click | css=.ant-btn | ');
			await driver.findElement(By.css('.ant-btn')).click();
			await sleep(5000);

			console.log(step++,' | click | css=.ml-4 > .ant-btn > span | ');
			await driver.findElement(By.css('.ml-4 > .ant-btn > span')).click();
			await sleep(3000);
		
			console.log(step++,' | click | css=.ant-select-selector | ');
			await driver.findElement(By.css('.ant-select-selector')).click();
			await sleep(3000);
		
			console.log(step++,' | click | xpath=//div[5]/div/div/div/div[2]/div[1]/div/div/div[4]/div/div/div[2] | ');
			// /div[4]={1,..9}
			let level= Math.floor(Math.random() * 9)+1;
			console.log('level : '+String(level))
			await sleep(3000);

			if (level > 4){
				console.log('driver.executeScript("window.scrollBy(0," +10+ ")');
				{
					const element = await driver.findElement(By.xpath('//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]'))
					await driver.executeScript('arguments[0].scrollIntoView(true);', element)
				}
				
				console.log(step++,' | click |xpath=//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]  |')
				await driver.findElement(By.xpath('//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]')).click();
				await sleep(3000);
		
				console.log(step++,' | click | css=.w-100 > span |');
				await driver.findElement(By.css('.w-100 > span')).click();
				await sleep(3000);
		
			}else{
				console.log(step++,' | click | xpath=//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2] |');
				await driver.findElement(By.xpath('//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]')).click();
				await sleep(3000);
			
				console.log(step++,' | click | css=.w-100 > span |');
				await driver.findElement(By.css('.w-100 > span')).click();
				await sleep(3000);
			}
	
			console.log(step++,' | open | website/summary | ');
			await driver.get(Website+'summary');
			await sleep(5000);

			console.log(step++,' | click | css=.app-bar-account-content > div:nth-child(2) | ');
			await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
			await sleep(3000);

			console.log(step++,' | click | css=.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3) | ');
			await driver.findElement(By.css('.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3)')).click();
			await sleep(3000);
		
			console.log(' entering into user account to assert  Level of Account');
		
			console.log(step++,' | open | '+logInPage+' | ');
			await driver.get(logInPage);
			await driver.sleep(5000);
			const title = await driver.getTitle();
			console.log(title);
				    
			console.log(step++,' | type | name=email |'+ username);
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.name('email')).sendKeys(username);
    
			console.log(step++,' | type | name=password | PASSWORD');
			await driver.findElement(By.name('password')).sendKeys(passWord);
    
			console.log(step++,' | click | css=.auth_wrapper | ');
			await driver.findElement(By.css('.auth_wrapper')).click();
		
			//'when login    
			console.log(step++,' | click | css=.holla-button | ');
			await driver.findElement(By.css('.holla-button')).click();
			await sleep(5000);

			console.log(step++,' | assert | css=.trader-account-wrapper .summary-block-title |Level '+String(level)+' Account');
			assert(await driver.findElement(By.css('.trader-account-wrapper .summary-block-title')).getText() == 'Level '+String(level)+' Account');
		
			console.log(step++,' | storeText | css=.trader-account-wrapper .summary-block-title | level');
			vars['level'] = await driver.findElement(By.css('.trader-account-wrapper .summary-block-title')).getText();
		
			console.log(step++,' | echo | ${level} | ');
			console.log(vars['level']);

			console.log('This is the EndOfTest');
			
		});
	});
}
describe('Main Test', function () {
 
	//AccountLevel();
})
module.exports = AccountLevel;