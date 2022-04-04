async function TFA(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const totp = require('totp-generator');
	const path = require('path')
	const { expect } = require('chai');
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
	// let userName = process.env.BOB;
	let User = process.env.NEW_USER;
	let passWord = process.env.PASSWORD;
	let emailPass = process.env.EMAIL_PASS;
	let logInPage = "https://dash.testnet.hollaex.com/login"//process.env.SIGN_UP_PAGE;
	let emailAdmin =process.env.EMAIL_ADMIN_USERNAME;
	const newUser = util.getNewUser();
	console.log(newUser);
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)
	
	describe('OTP', function() {
		this.timeout(300000);
		let driver;
		let vars;
		let code;
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
			// await driver.quit();
		});
		it('OTP', async function() {
			console.log ('  Test name: OTP');
			console.log ('  Step # | name | target | value ');
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
			
			//  console.log(step++,' | click | css=.exchange-name | ');
			//  await driver.findElement(By.css(".exchange-name")).click()
			//  assert(await driver.findElement(By.css(".exchange-name")).getText() == newUser)
			//  await sleep(5000);
			
			console.log('This is the EndOfTest');
			await sleep(1000);
			    // 3 | click | css=.name | 
			//	await driver.findElement(By.css(".name")).click()
			await driver.get("https://dash.testnet.hollaex.com/mypage/modify-password")
			await sleep(5000);
				// 4 | click | linkText=Security | 
			
				await driver.findElement(By.linkText("Security")).click()
				// 5 | click | css=div:nth-child(2) > div > span:nth-child(1) | 
				await sleep(5000);
				await driver.findElement(By.css("div:nth-child(2) > div > span:nth-child(1)")).click()
				// 6 | click | css=.otp_secret | 
				await sleep(5000);
				await driver.findElement(By.css(".otp_secret")).click()
				// 7 | storeText | css=.otp_secret | token
				await sleep(5000);
				code = vars["code"] = await driver.findElement(By.css(".otp_secret")).getText()
				console.log(step++,'  | echo | ${code} | ');
				let token = totp(code);
				console.log(code);
				console.log(token); 
				await sleep(5000);

				// 8 | click | id=otp form_otp | 
				console.log(step++,'  | mouseOver | id=otp form_otp)| ');
				{
					const element = await driver.findElement(By.id("otp form_otp"));
					await driver.executeScript('arguments[0].scrollIntoView(true);', element);
				}
				await driver.findElement(By.id("otp form_otp")).click()
				console.log(step++,' | type | id=otp form_otp |',token)
				await driver.findElement(By.id("otp form_otp")).clear();
				await driver.findElement(By.id("otp form_otp")).sendKeys(token)
			    await sleep(5000);
		
				console.log(step++,'  | mouseOver | css=.ant-btn:nth-child(1)| ');
				{
					const element = await driver.findElement(By.css(".ant-btn:nth-child(1)"));
					await driver.executeScript('arguments[0].scrollIntoView(true);', element);
				}
				// 9 | click | css=.ant-btn:nth-child(1) | 
				await driver.findElement(By.css(".ant-btn:nth-child(1)")).click()
				await sleep(5000);	
				
				console.log ('  16 | assertText | css=active | You have successfully activated 2FA');
				
				//*[@id="dash-main"]/div/section/main/div/div/div/div/div/div/div[2]/div[1]/div/div/span[2]/span
			     assert(await driver.findElement(By.css('.active')).getText() == 'Active');
				//assert(await driver.findElement(By.xpath('//*[@id="dash-main"]/div/section/main/div/div/div/div/div/div/div[2]/div[1]/div/div/span[2]/span')).getText() == 'Active');
		        await sleep(5000);

							await driver.get( "https://dash.testnet.hollaex.com/mypage")
		//xpath=//a[2]/div/span
		// console.log(step++,' | click | css=.name | ');
		// await driver.findElement(By.css(".name")).click()
		await sleep(5000);
		
		//css=.ant-btn-danger:nth-child(4) > a
		//	await driver.findElement(By.xpath("//a[contains(text(),'Logout')])")).click()//xpath=(//a[contains(text(),'Logout')])[2])
			await driver.findElement(By.css(".ant-btn-danger:nth-child(4) > a")).click()
			// console.log(step++,' | click | css=.ant-btn-danger:nth-child(4) > a | ');
		// await driver.findElement(By.css(".ant-btn-danger:nth-child(4) > a")).click()
		await sleep(5000);
         // id=login form_otp_code

		 await driver.wait(until.elementLocated(By.id('login form_email')), 5000);
		 await driver.findElement(By.id("login form_email")).clear();
		 await driver.findElement(By.id("login form_email")).sendKeys(newUser)

		 console.log(step++,' | type | id=login form_password | password')
		 await driver.findElement(By.id("login form_password")).clear();
		 await driver.findElement(By.id("login form_password")).sendKeys(passWord )
		 await sleep(1000);

		 console.log(step++,' | type | id=login form_password | password')
		 await driver.findElement(By.id("login form_otp_code")).clear();
		 token = totp(code);
		 await driver.findElement(By.id("login form_otp_code")).sendKeys(token)
		 await sleep(1000);

		 console.log(step++,' | click | css=.ant-btn | ')
		 await driver.findElement(By.css(".ant-btn")).click()
		 await sleep(1000);
	 
    
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


		console.log(step++,' | type | id=VerifyCode_form_code |', FirstTimeCod)
		await driver.findElement(By.id("VerifyCode_form_code")).sendKeys(FirstTimeCod)
		await sleep(5000);

		console.log(step++,'| click | css=.ant-btn | ');
		await driver.findElement(By.css(".ant-btn")).click()
		await sleep(5000);

		
		//  console.log(step++,' | click | css=.exchange-name | ');
		//  await driver.findElement(By.css(".exchange-name")).click()
		//  assert(await driver.findElement(By.css(".exchange-name")).getText() == newUser)
		//  await sleep(5000);
		
		console.log('This is the EndOfTest');
		await sleep(1000);
			// 3 | click | css=.name | 
		//	await driver.findElement(By.css(".name")).click()
		await driver.get("https://dash.testnet.hollaex.com/mypage/modify-password")
		await sleep(5000);
			// 4 | click | linkText=Security | 
		
			await driver.findElement(By.linkText("Security")).click()
			// 5 | click | css=div:nth-child(2) > div > span:nth-child(1) | 
			await sleep(5000);
				await driver.findElement(By.css(".active")).click()
			// 7 | storeText | css=.otp_secret | token
			await sleep(5000);
			token = totp(code);
			console.log(token); 
		
		console.log(step++,' | type | id=otp form_otp |',token)
		await driver.findElement(By.id("otp form_otp")).clear();
		await driver.findElement(By.id("otp form_otp")).sendKeys(token)

		await sleep(1000);
		await driver.findElement(By.css(".ant-btn:nth-child(1)")).click()
		await sleep(5000);
//otp form_otp
console.log ('  16 | assertText | css=active | You have successfully deactivated 2FA');
				
//*[@id="dash-main"]/div/section/main/div/div/div/div/div/div/div[2]/div[1]/div/div/span[2]/span
 assert(await driver.findElement(By.css('.Inactive')).getText() == 'Inactive');
//assert(await driver.findElement(By.xpath('//*[@id="dash-main"]/div/section/main/div/div/div/div/div/div/div[2]/div[1]/div/div/span[2]/span')).getText() == 'Active');
await sleep(5000);
			console.log('This is the EndOfTest');

		});


	});
}
describe('Main Test', function () {
 
TFA();
})
module.exports.TFA = TFA;