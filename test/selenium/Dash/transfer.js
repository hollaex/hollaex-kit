//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function logIn(){
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
	let Alice = process.env.ALICE;
	let Bob =process.env.BOB;
	let emailPage = process.env.EMAIL_PAGE;
	let passWord = process.env.PASSWORD;
	let emailPass = process.env.EMAIL_PASS;
	let logInPage = "https://dash.testnet.hollaex.com/login"//process.env.SIGN_UP_PAGE;
	let emailAdmin =process.env.EMAIL_ADMIN_USERNAME;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)
	console.log(Alice);
	

	describe('AliceRequest', function() {
		this.timeout(300000);
		let driver;
		let vars;
		let aliceBalance;
		let bobBalance;
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

		it('َBobLogIn', async function() {
			console.log('Test name: BobRequest');
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
			console.log(step++,' | type | id=login form_email |', Bob)
			await driver.wait(until.elementLocated(By.id('login form_email')), 5000);
			await driver.findElement(By.id("login form_email")).clear();
			await driver.findElement(By.id("login form_email")).sendKeys(Bob)

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
			expect(vars['content']).to.equal(Bob);
     
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
			
			//await driver.findElement(By.css(".tab:nth-child(1) > div")).click()
			//	await sleep(5000);

			await driver.get("https://dash.testnet.hollaex.com/wallet")
			await sleep(5000);
  			
			console.log(step++,' | click | css=.ant-table-row:nth-child(1) > td:nth-child(3)');
			await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3)")).click();
			await sleep(5000);

			console.log(step++,' | storeText | css=.ant-table-row:nth-child(1) > td:nth-child(3) > div | Balance');
			bobBalance =vars["Balance1"] = await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3) > div")).getText()
			console.log(vars["Balance1"]);
			await sleep(5000);
			
			console.log('This is the EndOfTest');
		});

		it('َAliceLogIn', async function() {
			console.log('Test name: AliceRequest');
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
			console.log(step++,' | type | id=login form_email |', Alice)
			await driver.wait(until.elementLocated(By.id('login form_email')), 5000);
			await driver.findElement(By.id("login form_email")).clear();
			await driver.findElement(By.id("login form_email")).sendKeys(Alice)

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
			expect(vars['content']).to.equal(Alice);
     
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
			
			//await driver.findElement(By.css(".tab:nth-child(1) > div")).click()
			//	await sleep(5000);

			await driver.get("https://dash.testnet.hollaex.com/wallet")
			await sleep(5000);
  			
			console.log(step++,' | click | css=.ant-table-row:nth-child(1) > td:nth-child(3)');
			await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3)")).click();
			await sleep(5000);

			console.log(step++,' | storeText | css=.ant-table-row:nth-child(1) > td:nth-child(3) > div | Balance');
			aliceBalance =vars["Balance"] = await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3) > div")).getText()
			console.log(vars["Balance"]);
			await sleep(5000);
			
			console.log(step++,' | click | linkText=Withdraw | ');
			await driver.findElement(By.linkText("Withdraw")).click()
			await sleep(5000);

			console.log(step++,' | type | id=Withdraw_address | 0x2cc7cdf297d70c8db9e362574e314827fd37cf83');
			await driver.findElement(By.id("Withdraw_address")).sendKeys("0x2cc7cdf297d70c8db9e362574e314827fd37cf83")
			await sleep(5000);

			console.log(step++,' | type | id=Withdraw_amount | 0.0001');
			await driver.findElement(By.id("Withdraw_amount")).sendKeys("0.0001")
			await sleep(5000);

			console.log(step++,' | click | css=.ant-btn:nth-child(2) | ');
			await driver.findElement(By.css(".ant-btn:nth-child(2)")).click()
			await sleep(5000);
	
			console.log(step++,' | assertText | css=.caution | Caution!');
			assert(await driver.findElement(By.css(".caution")).getText() == "Caution!")
			
			console.log(step++,' | click | css=.ant-btn:nth-child(2) | ');
			await driver.findElement(By.css(".ant-btn:nth-child(2)")).click()
			await sleep(5000);

			console.log(step++,' | click | css=.confirm | ');
			await driver.findElement(By.css(".confirm")).click()
			await sleep(5000);

			console.log(step++,' | assertText | css=.confirm | Confirm via Email!');
			assert(await driver.findElement(By.css(".confirm")).getText() == "Confirm via Email!")
			
			console.log(step++,' | click | css=.ant-btn-block:nth-child(1) | ');
			await driver.findElement(By.css(".ant-btn-block:nth-child(1)")).click()
			await sleep(5000);


			console.log('This is the EndOfTest');
	
			console.log('Test name: Confirmation');
			console.log('Step # | name | target | value');
		
			//await util.emailLogIn(step,driver,emailAdmin,emailPass);
		    await driver.get( emailPage)
			//await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
			await sleep(10000);

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
			vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[4]')).getText();
			let emailCont1 = await driver.findElement(By.css('pre')).getText();
		    let trickedEmailCont1 = util.chunkCleaner(emailCont1)
			
			console.log(step++,' | assertText | email contains | HollaEx Testnet Dashboard XHT Withdrawal Request...');
			expect(trickedEmailCont1.includes("HollaEx Testnet Dashboard XHT Withdrawal Request")).to.equal(true);

			console.log(trickedEmailCont1)
			console.log(step++,'  | echo | ${content} | ');
			console.log(vars['content']);
		
			console.log(step++,' | assertText | xpath=/html/body/pre/a[8] | ${content}');
			expect(vars['content']).to.equal(Alice.toLocaleLowerCase());
			
			console.log(step++,' ]@href | mytextlink');
			{
				const attribute1 = await driver.findElement(By.xpath('/html/body/pre/a[27]')).getAttribute('href');
				let link = vars['verificationtlink'] = attribute1;
				console.log(step++,' | click | xpath=/html/body/pre/a[27] | ');
				//await driver.findElement(By.xpath("/html/body/pre/a[27]")).click()
				await driver.get(link);
				await sleep(5000);
			}


			 console.log(step++,' | assertText | css=.ant-modal-confirm-title | Success')
             assert(await driver.findElement(By.css(".ant-modal-confirm-title")).getText() == "Success")
			 await sleep(2000);

			 //css=.ant-btn:nth-child(1)
			 console.log(step++,' | click | css=.ant-btn:nth-child(1) | ');
			 await driver.findElement(By.css(".ant-btn:nth-child(1)")).click()
			 await sleep(2000);
            // Your withdrawal request for 0.0001 XHT is processed.

			//await util.emailLogIn(step,driver,emailAdmin,emailPass);
			await driver.get( emailPage)
			//await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
			await sleep(10000);

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
					vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[4]')).getText();
					emailCont1 = await driver.findElement(By.css('pre')).getText();
					trickedEmailCont1 = util.chunkCleaner(emailCont1)

					console.log(step++,' | assertText | email contains | Status: COMPLETED...');
					expect(trickedEmailCont1.includes("Status: COMPLETED")).to.equal(true);
					await sleep(5000);

					await driver.get("https://dash.testnet.hollaex.com/wallet")
					await sleep(5000);

					console.log(step++,' | click | css=.ant-btn:nth-child(4) | ')
				    await driver.findElement(By.css(".ant-btn:nth-child(4)")).click()
	                await sleep(5000);

					console.log(step++,'| click | css=.ant-tabs-tab:nth-child(2) | ')
					await driver.findElement(By.css(".ant-tabs-tab:nth-child(2)")).click()
					await sleep(5000);

					console.log(step++,' | assertText | css=.ant-table-row:nth-child(1) > td:nth-child(3) > div | 0.0001')
					assert(await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3) > div")).getText() == "0.0001")
					await sleep(5000);

					console.log(step++,' | click | css=.ant-btn:nth-child(3) | ')
					await driver.findElement(By.css(".ant-btn:nth-child(3)")).click()
					await sleep(5000);

					console.log(step++,' | assertText | css=.ant-table-row:nth-child(1) > td:nth-child(3) > div | 8.9999')
					assert(await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3) > div")).getText() == (aliceBalance-0.0001).toString())
					await sleep(5000);
			 console.log('This is the EndOfTest');

		});
		it('َBobLogIn', async function() {
			console.log('Test name: BobRequest');
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
			console.log(step++,' | type | id=login form_email |', Bob)
			await driver.wait(until.elementLocated(By.id('login form_email')), 5000);
			await driver.findElement(By.id("login form_email")).clear();
			await driver.findElement(By.id("login form_email")).sendKeys(Bob)

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
			expect(vars['content']).to.equal(Bob);
     
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
			
			//await driver.findElement(By.css(".tab:nth-child(1) > div")).click()
			//	await sleep(5000);

			await driver.get("https://dash.testnet.hollaex.com/wallet")
			await sleep(5000);
  			
			console.log(step++,'| click | css=.ant-btn:nth-child(4) | ');
			await driver.findElement(By.css(".ant-btn:nth-child(4)")).click();
			await sleep(5000);

			console.log(step++,' | assertText | css=td:nth-child(3) > div | 0.0001');
			assert(await driver.findElement(By.css("td:nth-child(3) > div")).getText() == "0.0001")
			await sleep(5000);

			console.log(step++,' | click | css=.ant-btn:nth-child(3) | ');
			await driver.findElement(By.css(".ant-btn:nth-child(3)")).click()
			await sleep(5000);

			console.log(step++,' | assertText | css=.ant-table-row:nth-child(1) > td:nth-child(3) > div | 8.9999');
			assert(await driver.findElement(By.css(".ant-table-row:nth-child(1) > td:nth-child(3) > div")).getText() == (bobBalance+0.0001).toString())
			await sleep(5000);




			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	logIn();
})
module.exports.logIn = logIn;