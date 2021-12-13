//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function QuickTrade(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
	const path = require('path')
	const logPath = path.join(__dirname, './.log',path.basename(__filename,'.js'));
	const reportPath = path.join(__dirname, './../Report',path.dirname(__filename).replace(path.dirname(__dirname),''),path.basename(__filename,'.js'));
	const util = require ('../Utils/Utils.js');
	util.makeReportDir(reportPath);
	util.makeReportDir(logPath);
	require('console-stamp')(console, { 
		format: ':date(yyyy/mm/dd HH:MM:ss.l)|' 
	} );
	require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
	let userName = process.env.ADMIN_USER;
	let passWord = process.env.ADMIN_PASS;
	let logInPage = process.env.LOGIN_PAGE;
	let website = process.env.WEBSITE;
	let browser = process.env.BROWSER;
	let step = util.getStep();
	util.logHolla(logPath)


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
			driver = await new Builder().forBrowser('browser').build();
			vars = {};
			driver.manage().window().maximize();
			await util.kitLogIn(step,driver, userName,passWord);
	
		});
		afterEach(async function() {
			util.setStep(step)
	 //await driver.quit();
		});
		it('limit buy', async function() {

		
			console.log(step++,'  | open | /summary | ');
			//await driver.get("https://sandbox.hollaex.com/quick-trade/xht-usdt")//website  +'summary')
			await sleep(5000);
			// Test name: g
    // Step # | name | target | value
    // 1 | open | /login | 
    
    // 6 | click | css=.app-menu-bar-content:nth-child(3) .edit-wrapper__container | 
    await driver.findElement(By.css(".app-menu-bar-content:nth-child(3) .edit-wrapper__container")).click()
    // 7 | click | xpath=//div[@id='root']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div[2]/div/div[3]/div/span/div/div | 
    await driver.findElement(By.xpath("//div[@id=\'root\']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div[2]/div/div[3]/div/span/div/div")).click()
    // 8 | click | xpath=(//div[@name='selectedPairBase'])[7] | 
    await driver.findElement(By.xpath("(//div[@name=\'selectedPairBase\'])[7]")).click()
    // 9 | click | xpath=//div[@id='root']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div[2]/div/div[4]/div/span/div/div | 
    await driver.findElement(By.xpath("//div[@id=\'root\']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div[2]/div/div[4]/div/span/div/div")).click()
    // 10 | click | xpath=//span[contains(.,'USDT')] | 
    await driver.findElement(By.xpath("//span[contains(.,\'USDT\')]")).click()
    // 11 | click | css=.py-2:nth-child(3) .ant-input | 
    await driver.findElement(By.css(".py-2:nth-child(3) .ant-input")).click()
    // 12 | type | css=.py-2:nth-child(3) .ant-input | 4
    await driver.findElement(By.css(".py-2:nth-child(3) .ant-input")).sendKeys("4")
    // 13 | verifyEditable | css=.holla-button | 
    {
      const element = await driver.findElement(By.css(".holla-button"))
      assert(await element.isEnabled())
    }
			// console.log(step++,' | click | css=.app-menu-bar-content:nth-child(3) .edit-wrapper__container | ');
			// await driver.findElement(By.css(".app-menu-bar-content:nth-child(3) .edit-wrapper__container")).click()
			// await sleep(5000);

			// // console.log(step++,' | click | xpath=//div[@id=root]/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/span/div/div/span[2]/div | ');
			// // await driver.findElement(By.xpath("//div[@id=\'root\']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/span/div/div/span[2]/div")).click()
			// // await sleep(5000)
       
			// // console.log(step++,' | click | xpath=//div[2]/div/div/div/div/div/div/span | ');
			// // await driver.findElement(By.xpath("//div[2]/div/div/div/div/div/div/span")).click()
			// // await sleep(5000)
       
			// // console.log(step++,'  | click | css=.py-2:nth-child(2) .ant-input | ');
			// // await driver.findElement(By.css(".py-2:nth-child(2) .ant-input")).click()
       
			// // console.log(step++,'  | type | css=.py-2:nth-child(2) .ant-input | 1');
			// // await driver.findElement(By.css(".py-2:nth-child(2) .ant-input")).sendKeys("1")
			// // await sleep(5000)
      
			// // console.log(step++,'  | click | css=.holla-button | ');
			// // await driver.findElement(By.css(".holla-button")).click()
      
			// // console.log(step++,'  | click | css=.ReactModal__Content | ');
			// // await driver.findElement(By.css(".ReactModal__Content")).click()
       
			// // console.log(step++,'  | assertText | css=.review-block-wrapper:nth-child(1) .with_price-block_amount-value | 1');
			// // assert(await driver.findElement(By.css(".review-block-wrapper:nth-child(1) .with_price-block_amount-value")).getText() == "1")
      
			// await driver.findElement(By.xpath("//div[2]/div/div/div/div[7]/div/div")).click()
			// await sleep(5000);
			// // 3 | click | css=.ant-select-item-option-active .d-flex | 
			// await driver.findElement(By.css(".ant-select-item-option-active .d-flex")).click()
			// await sleep(5000);
			// // 4 | click | css=.py-2:nth-child(4) .ant-select-arrow svg | 
			// await driver.findElement(By.css(".py-2:nth-child(4) .ant-select-arrow svg")).click()
			// await sleep(5000);
			// // 5 | click | css=.ant-select-item-option-active .pl-1 | 
			// await driver.findElement(By.css(".ant-select-item-option-active .pl-1")).click()
			// await sleep(5000);
			// // 6 | click | css=.py-2:nth-child(3) .ant-input | 
			await driver.findElement(By.css(".py-2:nth-child(3) .ant-input")).click()
			await sleep(5000);
			// 7 | type | css=.py-2:nth-child(3) .ant-input | 1
			await driver.findElement(By.css(".py-2:nth-child(3) .ant-input")).sendKeys("1")
			await sleep(5000);
			// 8 | click | css=.holla-button | 
			await driver.findElement(By.css(".holla-button")).click()
			await sleep(5000);
			// 9 | click | css=.ml-2:nth-child(2) | 
			await driver.findElement(By.css(".ml-2:nth-child(2)")).click()
			await sleep(5000);
			// 10 | click | css=.holla-button:nth-child(4) | 
			await driver.findElement(By.css(".holla-button:nth-child(4)")).click()
			await sleep(5000);
			// 11 | click | css=.ml-2:nth-child(2) | 
			await driver.findElement(By.css(".ml-2:nth-child(2)")).click()
			await sleep(5000);
			console.log(step++,'  | click | css=.ml-2 | ');
			await driver.findElement(By.css(".ml-2")).click()
			hollaTime.Hollatimestampe();
			console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));
			await sleep(5000)
       
			console.log(step++,'  | click | css=.quote-success__title | ');
			await driver.findElement(By.css(".quote-success__title")).click()
       
			console.log(step++,'  | assertText | css=.quote-success__title | SUCCESS!');
			assert(await driver.findElement(By.css(".quote-success__title")).getText() == "SUCCESS!")
       
			console.log(step++,'  | click | css=.ml-2 | ');
			await driver.findElement(By.css(".ml-2")).click()
		
			// wallet check
			console.log(step++,'  | open| /transactions | ');
			await driver.get(website + 'transactions' );
			await sleep(10000);
		   
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp');
			vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) > .text-uppercase | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair');
			vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) .buy | side');
			vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .sell')).getText();
		
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size');
			vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price');
			vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount');
			vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
			console.log(step++,'  | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,'  | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee');
			vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
			console.log(step++,'  | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ');
			console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
			console.log(vars['timestamp']+" should be "+utile.getHollatimestamp());
			expect(vars['timestamp']).to.equal(util.getHollatimestamp());
        
			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
	//QuickTrade();
})
module.exports.QuickTrade = QuickTrade;