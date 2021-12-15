//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function SignUp(){
	const { Builder, By, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
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
	let User = process.env.NEW_USER;
	let passWord = process.env.PASSWORD;
	let signUpPage = process.env.SIGN_UP_PAGE;
	let emailAdmin =process.env.EMAIL_ADMIN_USERNAME;
	let emailPass = process.env.EMAIL_PASS;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)
	const newUser = util.defineNewUser(User,4) ;
	console.log(newUser);

	describe('NewUser Request For Registeration', function() {
		this.timeout(300000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}
		beforeEach(async function() {
			driver = await new Builder().forBrowser(browser).build();
			vars = {};
			await driver.manage().window().maximize();
			let step = util.getStep()
		});

		afterEach(async function() {
			util.setStep(step);
			await driver.quit();
		});

		it('FillUp The Form By NewUser Request', async function() {
			console.log('Test name: NewUserRequest');
			console.log(' Step # | name | target | value');
		
			console.log(step++,'  | open | ',signUpPage);
			await driver.get(signUpPage);
			//driver.manage().window().maximize();

			
			console.log(step++,'  | type | name=email |',newUser);
			await driver.wait(until.elementLocated(By.name('email')), 10000);
			await driver.findElement(By.name('email')).clear();
			await driver.findElement(By.name('email')).sendKeys(newUser);
     
			console.log(step++,'  | type | name=password | password!');
			await driver.findElement(By.name('password')).clear();
			await driver.findElement(By.name('password')).sendKeys(passWord);
      
      
			console.log(step++,'  | type | name=password_repeat | your password again!');
			await driver.findElement(By.name('password_repeat')).clear();
			await driver.findElement(By.name('password_repeat')).sendKeys(passWord);
			await sleep(2000);
		
			console.log(step++,'  | click | name=terms |'); 
			await driver.findElement(By.name('terms')).click();
			await sleep(10000);
			
		
			console.log(step++,'  | click | css=.holla-button |'); 
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 10000);
			await driver.findElement(By.css('.holla-button')).click();
			await driver.executeScript('window.scrollTo(0,0)');
			await sleep(2000);

			console.log('This is the EndOfTest');
		});

		it('Email Confirmation', async function() {
			console.log('Test name: Confirmation');
			console.log('Step # | name | target | value');
		
			await util.emailLogIn(step,driver,emailAdmin,emailPass);
		
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
		
			await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
	
			console.log(step++,' | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
			{
				const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
				await driver.actions({ bridge: true}).doubleClick(element).perform();
			}
		
			console.log(step++,' | selectFrame | index=1 | ');
			await driver.switchTo().frame(1);
			await sleep(10000);
		
			console.log(step++,' | storeText | xpath=/html/body/pre/a[22] | content');
			vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[22]')).getText();
			const emailCont = await driver.findElement(By.css('pre')).getText();
		
			console.log(step++,'  | echo | ${content} | ');
			console.log(vars['content']);
		
			console.log(step++,' | assertText | xpath=/html/body/pre/a[22] | ${content}');
			expect(vars['content']).to.equal(newUser.toLowerCase());
     
			console.log(step++,' ]@href | mytextlink');
			{
				const attribute = await driver.findElement(By.xpath('/html/body/pre/a[26]')).getAttribute('href');
				vars['mytextlink'] = attribute;
			}
		
			console.log(step++,'  | echo | ${mytextlink} | ');
			console.log(vars['mytextlink']);
			console.log(step++,' | echo | \'xpath=/html/body/pre/a[26]\' | ');
			console.log('\'xpath=/html/body/pre/a[26]\'');
			console.log(step++,'  | open | ${mytextlink} | ');
		
			const completedLink = await util.addRest(emailCont,vars['mytextlink']);
			await console.log(completedLink);
			await driver.get(completedLink);
			await sleep(1000);
		
			console.log(step++,'  | selectFrame | relative=parent | ');
			await driver.switchTo().defaultContent();
			await sleep(5000);
			
			console.log(step++,'  | click | css=.icon_title-wrapper | ');
			await driver.findElement(By.css('.icon_title-wrapper')).click();
		
			console.log(step++,'  | assertNotText | css=.icon_title-text | Error');
			{
				const text = await driver.findElement(By.css('.icon_title-text')).getText();
				assert(text !== 'Error');
			}

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	//SignUp();
})
module.exports.SignUp = SignUp;