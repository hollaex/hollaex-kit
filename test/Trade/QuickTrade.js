//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const testContext = require ('./../onboarding/Newuser')
const { expect } = require('chai');
const { Console } = require('console');
const hollaTime = require('./time');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
const path = require('path')
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
		await testContext.kitLogIn(driver, userName,passWord);
	
	});
	afterEach(async function() {
	 //await driver.quit();
	});
	it('limit buy', async function() {

		
		await driver.manage().window().maximize() ;
		console.log(' 1 | open | /trade/xht-usdt | ');
		//await driver.get(website+ 'trade/xht-usdt');
		
        await driver.get(website  +'summary')
        await sleep(5000);
        // 2 | click | css=.app-menu-bar-content:nth-child(3) .edit-wrapper__container | 
        await driver.findElement(By.css(".app-menu-bar-content:nth-child(3) .edit-wrapper__container")).click()
        // 3 | click | xpath=//div[@id='root']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/span/div/div/span[2]/div | 
        await driver.findElement(By.xpath("//div[@id=\'root\']/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/span/div/div/span[2]/div")).click()
        // 4 | pause | 5000 | 
        await sleep(5000)
        // 5 | click | xpath=//div[2]/div/div/div/div/div/div/span | 
        await driver.findElement(By.xpath("//div[2]/div/div/div/div/div/div/span")).click()
        // 6 | pause | 5000 | 
        await sleep(5000)
        // 7 | click | css=.py-2:nth-child(2) .ant-input | 
        await driver.findElement(By.css(".py-2:nth-child(2) .ant-input")).click()
        // 8 | type | css=.py-2:nth-child(2) .ant-input | 1
        await driver.findElement(By.css(".py-2:nth-child(2) .ant-input")).sendKeys("1")
        // 9 | pause | 5000 | 
        await sleep(5000)
        // 10 | click | css=.holla-button | 
        await driver.findElement(By.css(".holla-button")).click()
        // 11 | click | css=.ReactModal__Content | 
        await driver.findElement(By.css(".ReactModal__Content")).click()
        // 12 | assertText | css=.review-block-wrapper:nth-child(1) .with_price-block_amount-value | 1
        assert(await driver.findElement(By.css(".review-block-wrapper:nth-child(1) .with_price-block_amount-value")).getText() == "1")
        // 13 | click | css=.ml-2 | 
        await driver.findElement(By.css(".ml-2")).click()
        hollaTime.Hollatimestampe();
		console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));
        await sleep(5000)
        // 14 | click | css=.quote-success__title | 
        await driver.findElement(By.css(".quote-success__title")).click()
        // 15 | assertText | css=.quote-success__title | SUCCESS!
        assert(await driver.findElement(By.css(".quote-success__title")).getText() == "SUCCESS!")
        // 16 | click | css=.ml-2 | 
        await driver.findElement(By.css(".ml-2")).click()
		
		

        // wallet check
	
		await driver.get(website + 'transactions' );
		await driver.manage().window().maximize() ;
		await sleep(10000);
		//await driver.findElement(By.css(".trade_block-wrapper:nth-child(2) .action_notification-text")).click()
   
		// 2 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		// 3 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp
		vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		// 4 | click | css=.table_body-row:nth-child(1) > .text-uppercase | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		// 5 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair
		vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		// 6 | click | css=.table_body-row:nth-child(1) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		// 7 | storeText | css=.table_body-row:nth-child(1) .buy | side
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .sell')).getText();
		// 8 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		// 9 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size
		vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		// 10 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		// 11 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price
		vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		// 12 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		// 13 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount
		vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		// 14 | click | css=.table_body-row:nth-child(1) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		// 15 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee
		vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		// 16 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | 
		console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
		console.log(vars['timestamp']+" should be "+hollaTime.GetHollatimestampe());
		expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());
           
		  

	});

	
  
});
