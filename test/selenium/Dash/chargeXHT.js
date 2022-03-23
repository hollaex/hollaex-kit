//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function chargeXHT(){
	const { Builder, By, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const path = require('path')
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('../Utils/Utils.js');
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
	let logInPage = "https://dash.testnet.hollaex.com/login"//process.env.SIGN_UP_PAGE;
	let emailAdmin =process.env.EMAIL_ADMIN_USERNAME;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)
	const newUser = util.getNewUser();
	console.log(newUser);
	

	describe('NewUserRequest', function() {
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
		//	await driver.quit();
		});

		it('FirstTimeLogIn', async function() {
			console.log('Test name: NewUserRequest');
			console.log(' Step # | name | target | value');
		
			console.log(step++,'  | open | ',logInPage);
			await driver.get(logInPage);
			driver.manage().window().maximize();
			await sleep(5000);
			{	const title = await driver.getTitle();
				console.log(title);
				expect(title).to.equal(title);
			}
     
		//	await driver.get("https://dash.testnet.hollaex.com/login")
			console.log(step++,' | type | id=login form_email |', newUser)
			await driver.wait(until.elementLocated(By.id('login form_email')), 5000);
			await driver.findElement(By.id("login form_email")).clear();
			await driver.findElement(By.id("login form_email")).sendKeys(newUser)

			console.log(step++,' | type | id=login form_password | password')
			await driver.findElement(By.id("login form_password")).clear();
			await driver.findElement(By.id("login form_password")).sendKeys(passWord )
			await sleep(1000);

			console.log(step++,' | click | css=.ant-btn | ')
			await driver.findElement(By.css(".ant-btn")).click()
			await sleep(1000);
		

			console.log('This is the EndOfTest');
		});

		it('Code', async function() {
			console.log('Test name: Exchange Creation');
			console.log('Step # | name | target | value');
		
			await util.emailLogIn(step,driver,emailAdmin,emailPass);
		
			await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
		
			await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
			await sleep(3000);
			console.log(step++,' | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
			{
				const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
				await driver.actions({ bridge: true}).doubleClick(element).perform();
			}
			await sleep(3000);
			console.log(step++,' | selectFrame | index=1 | ');
			await driver.switchTo().frame(1);
			await sleep(10000);
		
			console.log(step++,' | storeText | xpath=/html/body/pre/a[22] | content');
			vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[22]')).getText();
			const emailCont = await driver.findElement(By.css('pre')).getText();
		    const trickedEmailCont = emailCont.split('Please use this code to enter your account:\\r\\n      </p>\\r\\n       <p style=\\"font-size: 1.3rem; text-align: center;\\">\\r\\n        ')
			const FirstTimeCod = trickedEmailCont[1].substring(0,12)
			console.log("The cod is: "+FirstTimeCod)
			console.log(step++,'  | echo | ${content} | ');
			console.log(vars['content']);
		
			console.log(step++,' | assertText | xpath=/html/body/pre/a[8] | ${content}');
			expect(vars['content']).to.equal(newUser);
     
			console.log(step++,' ]@href | mytextlink');
			{
				const attribute = await driver.findElement(By.xpath('/html/body/pre/a[27]')).getAttribute('href');
				vars['mytextlink'] = attribute;
			}

			await driver.get("https://dash.testnet.hollaex.com/verify-code")
			await sleep(5000);

			console.log(step++,' | click | id=VerifyCode_form_code | ')
			await driver.findElement(By.id("VerifyCode_form_code")).click()
			await sleep(2000);

			console.log(step++,' | type | id=VerifyCode_form_code |', FirstTimeCod)
			await driver.findElement(By.id("VerifyCode_form_code")).sendKeys(FirstTimeCod)
			await sleep(5000);

			console.log(step++,'| click | css=.ant-btn | ');
			await driver.findElement(By.css(".ant-btn")).click()
			await sleep(5000);
			
            await driver.get("https://dash.testnet.hollaex.com/wallet")
            // 2 | mouseOver | css=.sidebar-menu-dash | 
            // {
            //   const element = await driver.findElement(By.css(".sidebar-menu-dash"))
            //   await driver.actions({ bridge: true }).moveToElement(element).perform()
            // }
            await sleep(5000);
             // 3 | click | css=.tab:nth-child(1) > div | 
            await driver.findElement(By.css(".tab:nth-child(1) > div")).click()
            await sleep(5000);// 4 | click | css=.ant-btn:nth-child(5) | 

            await driver.findElement(By.css(".ant-btn:nth-child(5)")).click()
            await sleep(5000);
            await sleep(5000);// 5 | click | css=.ant-btn:nth-child(1) | 

            await driver.findElement(By.css(".ant-btn:nth-child(1)")).click()
            await sleep(5000);// 6 | click | css=.ant-input:nth-child(2) | 

            await driver.findElement(By.css(".ant-input:nth-child(2)")).click()
            await sleep(5000);// 7 | type | css=.ant-input:nth-child(2) | 0.00001

            await driver.findElement(By.css(".ant-input:nth-child(2)")).sendKeys("0.00001")
            await sleep(5000);
            // 8 | click | css=.ant-btn:nth-child(1) | 
            await driver.findElement(By.css(".ant-btn:nth-child(1)")).click()
            await sleep(5000);
            // 9 | click | css=.anticon-copy | 
            await driver.findElement(By.css(".anticon-copy")).click()
            await sleep(5000);
             // 10 | click | css=.ant-btn:nth-child(1) | 
            await driver.findElement(By.css(".ant-btn:nth-child(1)")).click()
			await sleep(5000);

			console.log('This is the EndOfTest');
		});

	});
}
describe('Main Test', function () {
 
	chargeXHT();
})
module.exports.chargeXHT = chargeXHT;