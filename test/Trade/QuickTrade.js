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
			util.kitLogIn(driver, userName,passWord);
	
		});
		afterEach(async function() {
	 //await driver.quit();
		});
		it('limit buy', async function() {

		
			console.log(' 7 | open | /summary | ');
			await driver.get(website  +'summary')
			await sleep(5000);
      
			console.log(' 8 | click | css=.app-menu-bar-content:nth-child(3) .edit-wrapper__container | ');
			await driver.findElement(By.css(".app-menu-bar-content:nth-child(3) .edit-wrapper__container")).click()
    
			console.log(' 9| click | xpath=//div[@id=root]/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/span/div/div/span[2]/div | ');
			await driver.findElement(By.xpath("//div[@id=\'root\']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/span/div/div/span[2]/div")).click()
			await sleep(5000)
       
			console.log(' 10 | click | xpath=//div[2]/div/div/div/div/div/div/span | ');
			await driver.findElement(By.xpath("//div[2]/div/div/div/div/div/div/span")).click()
			await sleep(5000)
       
			console.log(' 11 | click | css=.py-2:nth-child(2) .ant-input | ');
			await driver.findElement(By.css(".py-2:nth-child(2) .ant-input")).click()
       
			console.log(' 12 | type | css=.py-2:nth-child(2) .ant-input | 1');
			await driver.findElement(By.css(".py-2:nth-child(2) .ant-input")).sendKeys("1")
			await sleep(5000)
      
			console.log(' 13 | click | css=.holla-button | ');
			await driver.findElement(By.css(".holla-button")).click()
      
			console.log(' 14 | click | css=.ReactModal__Content | ');
			await driver.findElement(By.css(".ReactModal__Content")).click()
       
			console.log(' 15 | assertText | css=.review-block-wrapper:nth-child(1) .with_price-block_amount-value | 1');
			assert(await driver.findElement(By.css(".review-block-wrapper:nth-child(1) .with_price-block_amount-value")).getText() == "1")
      
			console.log(' 16 | click | css=.ml-2 | ');
			await driver.findElement(By.css(".ml-2")).click()
			hollaTime.Hollatimestampe();
			console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));
			await sleep(5000)
       
			console.log(' 17 | click | css=.quote-success__title | ');
			await driver.findElement(By.css(".quote-success__title")).click()
       
			console.log(' 18 | assertText | css=.quote-success__title | SUCCESS!');
			assert(await driver.findElement(By.css(".quote-success__title")).getText() == "SUCCESS!")
       
			console.log(' 19 | click | css=.ml-2 | ');
			await driver.findElement(By.css(".ml-2")).click()
		
			// wallet check
			console.log(' 20 | open| /transactions | ');
			await driver.get(website + 'transactions' );
			await sleep(10000);
		   
			console.log(' 21 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
			console.log(' 22 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp');
			vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
			console.log(' 23 | click | css=.table_body-row:nth-child(1) > .text-uppercase | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
			console.log(' 24 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair');
			vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
			console.log(' 25 | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(' 26 | storeText | css=.table_body-row:nth-child(1) .buy | side');
			vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .sell')).getText();
		
			console.log(' 27 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
			console.log(' 28 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size');
			vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
			console.log(' 29 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(' 30 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price');
			vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
			console.log(' 31 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
			console.log(' 32 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount');
			vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
			console.log(' 32 | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(' 33 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee');
			vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
			console.log(' 34 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ');
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