
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function assetMarket(){
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
	const newUser = 'bob@testsae.com'//util.getNewUser();
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
			

            // 3 | click | css=a:nth-child(4) > .sidebar-menu | 
            await driver.findElement(By.css("a:nth-child(4) > .sidebar-menu")).click()
            await sleep(5000);
            // 4 | click | css=.ant-input | 
            await driver.findElement(By.css(".ant-input")).click()
            await sleep(5000);
            // 5 | type | css=.ant-input | bitcoin
            await driver.findElement(By.css(".ant-input")).sendKeys("bitcoin")
            await sleep(5000);
            // 6 | click | css=.filter-btn | 
            await driver.findElement(By.css(".filter-btn")).click()
            await sleep(5000);
            // 7 | click | css=.ant-table-row > .balance-column:nth-child(2) | 
            await driver.findElement(By.css(".ant-table-row > .balance-column:nth-child(2)")).click()
            await sleep(5000);
            // 8 | assertText | css=.ant-table-row > .balance-column:nth-child(2) | verified
            assert(await driver.findElement(By.css(".ant-table-row > .balance-column:nth-child(2)")).getText() == "verified")
            // 9 | click | css=.ant-select-selection | 
            await driver.findElement(By.css(".ant-select-selection")).click()
            await sleep(5000);
            // 10 | click | css=.ant-select-dropdown-menu-item | 
            await driver.findElement(By.css(".ant-select-dropdown-menu-item")).click()
            await sleep(5000);
            // 11 | click | css=.create-asset-btn | 
            await driver.findElement(By.css(".create-asset-btn")).click()
            await sleep(5000);
            // 12 | click | css=.asset-coin | 
            await driver.findElement(By.css(".asset-coin")).click()
            await sleep(5000);
            // 13 | click | css=.ant-input:nth-child(3) | 
            await driver.findElement(By.css(".ant-input:nth-child(3)")).click()
            await sleep(5000);
            // 14 | click | css=.coin-option:nth-child(2) | 
            await driver.findElement(By.css(".coin-option:nth-child(2)")).click()
            await sleep(5000); 
            // 15 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            await sleep(5000);
            // 16 | mouseOver | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            {
                const element = await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)"))
                await driver.actions({ bridge: true }).moveToElement(element).perform()
            }
            // 17 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            await sleep(5000);
            // 18 | click | css=.ant-table-row:nth-child(2) .selected-asset | 
            await driver.findElement(By.css(".ant-table-row:nth-child(2) .selected-asset")).click()
            await sleep(5000);
            // 19 | click | css=.ant-btn | 
            await driver.findElement(By.css(".ant-btn")).click()
            await sleep(5000);
            // 20 | click | css=a:nth-child(5) > .sidebar-menu | 
            await driver.findElement(By.css("a:nth-child(5) > .sidebar-menu")).click()
            await sleep(5000);
            // 21 | click | css=.ant-input | 
            await driver.findElement(By.css(".ant-input")).click()
            await sleep(5000);
            // 22 | type | css=.ant-input | btc
            await driver.findElement(By.css(".ant-input")).sendKeys("btc")
            await sleep(5000);
            await sleep(5000);
            // 23 | click | css=.filter-btn | 
            await driver.findElement(By.css(".filter-btn")).click()
            await sleep(5000);
            // 24 | click | css=.create-pairs-btn | 
            await driver.findElement(By.css(".create-pairs-btn")).click()
            await sleep(5000);
            // 25 | mouseOver | css=.create-pairs-btn | 
            {
                const element = await driver.findElement(By.css(".create-pairs-btn"))
                await driver.actions({ bridge: true }).moveToElement(element).perform()
            }
            // 26 | mouseOut | css=.create-pairs-btn | 
            {
                const element = await driver.findElement(By.CSS_SELECTOR, "body")
                await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
            }
            // 27 | click | css=.asset-pairs | 
            await driver.findElement(By.css(".asset-pairs")).click()
            await sleep(5000);
            // 28 | click | css=.anchor | 
            await driver.findElement(By.css(".anchor")).click()
            await sleep(5000);
            // 29 | click | css=.ant-select-focused > .ant-select-selection | 
            await driver.findElement(By.css(".ant-select-focused > .ant-select-selection")).click()
            await sleep(5000);
            // 30 | click | css=.ant-select-open > .ant-select-selection | 
            await driver.findElement(By.css(".ant-select-open > .ant-select-selection")).click()
            await sleep(5000);
            // 31 | click | css=.ant-select-focused .ant-select-selection__rendered | 
            await driver.findElement(By.css(".ant-select-focused .ant-select-selection__rendered")).click()
            await sleep(5000);
            // 32 | click | css=.ant-select-open .ant-select-selection__rendered | 
            await driver.findElement(By.css(".ant-select-open .ant-select-selection__rendered")).click()
            await sleep(5000);
            // 33 | click | linkText=here. | 
            await driver.findElement(By.linkText("here.")).click()
            await sleep(5000);
            // 34 | click | css=.asset-coin > div | 
            await driver.findElement(By.css(".asset-coin > div")).click()
            await sleep(5000);
            // 35 | click | css=.coin-option:nth-child(2) | 
            await driver.findElement(By.css(".coin-option:nth-child(2)")).click()
            await sleep(5000);
            // 36 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            await sleep(5000);
            // 37 | mouseOver | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            {
                const element = await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)"))
                await driver.actions({ bridge: true }).moveToElement(element).perform()
            }
            // 38 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            await sleep(5000);
            // 39 | click | css=a:nth-child(5) > .sidebar-menu | 
            await driver.findElement(By.css("a:nth-child(5) > .sidebar-menu")).click()
            await sleep(5000);
            // 40 | click | css=.create-pairs-btn | 
            await driver.findElement(By.css(".create-pairs-btn")).click()
            await sleep(5000);
            // 41 | mouseOver | css=.create-pairs-btn | 
            {
                const element = await driver.findElement(By.css(".create-pairs-btn"))
                await driver.actions({ bridge: true }).moveToElement(element).perform()
            }
            // 42 | mouseOut | css=.create-pairs-btn | 
            {
                const element = await driver.findElement(By.CSS_SELECTOR, "body")
                await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
            }
            // 43 | click | css=.asset-pairs | 
            await driver.findElement(By.css(".asset-pairs")).click()
            await sleep(5000);
            // 44 | click | css=.anchor | 
            await sleep(5000);
            await driver.findElement(By.css(".anchor")).click()
            // 45 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            await sleep(5000);
            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            // 46 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 
            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            await sleep(5000);
            // 47 | click | css=.btn-wrapper > .ant-btn:nth-child(3) | 

            await driver.findElement(By.css(".btn-wrapper > .ant-btn:nth-child(3)")).click()
            await sleep(5000);

			
			console.log('This is the EndOfTest');
		});
		
	});
}
describe('Main Test', function () {
 
	assetMarket();
})
module.exports.assetMarket = assetMarket;
  
  
  
  