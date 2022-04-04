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
	let emailPass = process.env.EMAIL_PASS;
	let signUpPage = process.env.DASH_WEBSITE;
	let emailAdmin =process.env.EMAIL_ADMIN_USERNAME;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)
	const newUser = util.defineNewUser(User,4) ;
	console.log(newUser);
	console.log(browser,signUpPage)

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
			let step = util.getStep()
		});

		afterEach(async function() {
			util.setStep(step);
			await sleep(10000)
			await driver.quit();
		});

		it('FillUpNewUserRequest', async function() {
			console.log('Test name: NewUserRequest');
			console.log(' Step # | name | target | value');
		
			console.log(step++,'  | open | ',signUpPage);
			await driver.get(signUpPage+"signup");
			{	const title = await driver.getTitle();
				console.log(title);
				expect(title).to.equal(title);
			}
     
			console.log(step++,'  | type | id=login form_email |',newUser);
			await driver.wait(until.elementLocated(By.name('email')), 5000);
			await driver.findElement(By.id("login form_email")).clear();
			await driver.findElement(By.id("login form_email")).sendKeys(newUser);
     
			console.log(step++,'  | type | id=login form_password | password!');
			await driver.findElement(By.id("login form_password")).clear();
			await driver.findElement(By.id("login form_password")).sendKeys(passWord);
      
      
			console.log(step++,'  | type | id=login form_checkPw | your password again!');
			await driver.findElement(By.id("login form_checkPw")).clear();
			await driver.findElement(By.id("login form_checkPw")).sendKeys(passWord);
			await sleep(2000);
		
			console.log(step++,'  | click | css=.ant-checkbox-input |'); 
			await driver.findElement(By.css(".ant-checkbox-input")).click();
			await sleep(5000);
          
			console.log(step++,'  | click | xpath=//button[@type="submit"]|'); 
			//await driver.wait(until.elementIsEnabled(await driver.findElement(By.css(".ant-btn"))), 50000);
			await driver.findElement(By.xpath("//button[@type='submit']")).click();
			//await driver.executeScript('window.scrollTo(0,0)');

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
			expect(vars['content']).to.equal(newUser);
     
			console.log(step++,' ]@href | mytextlink');
			{
				const attribute = await driver.findElement(By.xpath('/html/body/pre/a[27]')).getAttribute('href');
				vars['mytextlink'] = attribute;
			}
		
			console.log(step++,'  | echo | ${mytextlink} | ');
			console.log(vars['mytextlink']);
			console.log(step++,' | echo | \'xpath=/html/body/pre/a[27]\' | ');
			console.log('\'xpath=/html/body/pre/a[27]\'');
			console.log(step++,'  | open | ${mytextlink} | ');
		
			const completedLink = await util.addRest(emailCont,vars['mytextlink']);
			await console.log(completedLink);
			await driver.get(completedLink);
			await sleep(10000);
            
            console.log(step++,'//*[@id="root"]/div/div[1]/div[2]/div/h3');
            assert(await driver.findElement(By.xpath('//*[@id="root"]/div/div[1]/div[2]/div/h3')).getText() == "You've successfully signed Up!")
		

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	SignUp();
})
module.exports.SignUp = SignUp;