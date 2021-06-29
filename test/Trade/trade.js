//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const dotenv = require('dotenv');
const hollaTime = require('./time');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
dotenv.config();
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
		// Test name: Untitled
		// Step # | name | target | value
		// 1 | open | /account | 
		await driver.get(logInPage);
		await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
		// 4 | click | name=email | 
   
		await sleep(4000);
		// await driver.findElement(By.name("email")).click();
		// // 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('limit buy', async function() {

		// await driver.manage().window().setRect(1050, 660)
   
		// 3 | click | css=.home_app_bar > .pointer |  | 
		await sleep(4000);
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		// 5 | click | name=Search Assets |  | 
		await driver.findElement(By.name('Search Assets')).click();
		// 6 | type | name=Search Assets | xht | 
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		// 7 | sendKeys | name=Search Assets | ${KEY_ENTER} | 
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		// 8 | click | css=.trade_tab-pair-sub-title |  | 
		await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		// 9 | click | name=size |  | 
		await sleep(3000);
		await driver.findElement(By.name('size')).click();
		// 10 | type | name=size | 1 | 
		await driver.findElement(By.name('size')).sendKeys('1');
		
		await driver.manage().window().maximize() ;
		console.log(' 1 | open | /trade/xht-usdt | ');
		//await driver.get(website+ 'trade/xht-usdt');
		await sleep(5000);
		//itrating on elms
		// let elms = await driver.findElements(By.className("f-1 trade_orderbook-cell trade_orderbook-cell_total pointer"));
		// for (var elm in elms){}
		console.log(' 2 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		console.log(' 3 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		console.log(' 4 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		console.log(' 9 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		console.log(' 10 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		console.log(' 11 | click | css=.holla-button | ');
		
		// 11 | click | css=.holla-button |  | 
		await driver.findElement(By.css('.holla-button')).click();
		// 12 | click | css=.notification-content-information > .d-flex:nth-child(1) |  | 
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		// 13 | assertText | css=.text-capitalize | Limit Buy | 
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Limit Buy');
		// 14 | click | css=.d-flex > .holla-button:nth-child(3) |  | 
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		// 15 | click | css=.w-100 .ant-select-selection-item |  | 
		hollaTime.Hollatimestampe();
		console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));

		await driver.findElement(By.css('.w-100 .ant-select-selection-item')).click();
		// 16 | click | css=.ant-select-item-option-active > .ant-select-item-option-content |  | 
		await driver.findElement(By.css('.ant-select-item-option-active > .ant-select-item-option-content')).click();
		// 17 | click | name=stop |  | 
		console.log(' 18 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
		//console.log(' 20 | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		console.log(' 19 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		console.log(' 20 echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

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
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .buy')).getText();
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
           
		await sleep(2000);
		   // 1 | open | /trade/xht-usdt | 
		   await driver.get(website+"trade/xht-usdt");
		   await sleep (5000);
		   // 2 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime
		   vars["LiveSaleTime"] = await driver.findElement(By.css(".display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row")).getText();
		   // 3 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | 
		   await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).click();
		   // 4 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime
		   vars["ActivityOrderTime"] = await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).getText();
		   console.log(" Activity order time : "+vars["ActivityOrderTime"]+"Live sale time : "+vars["LiveSaleTime"] );
		   expect(vars["LiveSaleTime"] ).to.equal(hollaTime.GetHollatimestampe());
		   expect(vars["ActivityOrderTime"]).to.equal(hollaTime.GetHollatimestampe());
		

	});

	it('Limit Sell', async function() {

		// 2 | setWindowSize | 1050x660 | 
		await driver.manage().window().maximize() ;
		await sleep(4000);
		// 3 | click | css=.home_app_bar > .pointer | 
		//  await driver.findElement(By.css(".home_app_bar > .pointer")).click()
		// 4 | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container | 
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		// 5 | click | name=Search Assets | 
		await driver.findElement(By.name('Search Assets')).click();
		// 6 | type | name=Search Assets | xht
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		// 7 | sendKeys | name=Search Assets | ${KEY_ENTER}
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		// 8 | click | css=.highcharts-background | 
		await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		// 9 | click | css=.holla-button-font:nth-child(2) | 
		await sleep(4000);
		await driver.findElement(By.css('.holla-button-font:nth-child(2)')).click();
		// 10 | click | name=size | 
		await driver.findElement(By.name('size')).click();
		// 11 | type | name=size | 1
		await driver.findElement(By.name('size')).sendKeys('1');
		// 12 | click | css=.holla-button | 

		console.log(' 2 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		console.log(' 3 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		console.log(' 4 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		//
		console.log(' 9 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		console.log(' 10 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		console.log(' 11 | click | css=.holla-button | ');


		await driver.findElement(By.css('.holla-button')).click();
		// 13 | click | css=.text-capitalize | 
		await driver.findElement(By.css('.text-capitalize')).click();
		// 14 | assertText | css=.text-capitalize | Limit Sell
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Limit Sell');
		// 15 | click | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).click();
		// 16 | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		// 17 | click | css=.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2) | 
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2)')).click();
		// 18 | assertText | css=.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2) | 1 USDT
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2)')).getText() == '1 USDT');
		// 19 | click | css=.d-flex > .holla-button:nth-child(3) | 
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();

		hollaTime.Hollatimestampe();
		console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));


		// 20 | click | css=.table_body-row:nth-child(1) .action_notification-text | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();

		console.log(' 18 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
		//console.log(' 20 | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		console.log(' 19 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		console.log(' 20 echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

        // 	
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
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .buy')).getText();
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

		await sleep(2000);
		console.log("| open | /trade/xht-usdt | ");
		await driver.get(website+"trade/xht-usdt");
		await sleep (5000);
		// 2 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime
		vars["LiveSaleTime"] = await driver.findElement(By.css(".display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row")).getText();
		// 3 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | 
		await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).click();
		// 4 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime
		vars["ActivityOrderTime"] = await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).getText();
		console.log(" Activity order time : "+vars["ActivityOrderTime"]+"Live sale time : "+vars["LiveSaleTime"] );
		expect(vars["LiveSaleTime"] ).to.equal(hollaTime.getHollaTime());
		expect(vars["ActivityOrderTime"]).to.equal(hollaTime.GetHollatimestampe());



	});

	it('Market buy', async function(){
		console.log(' Test name: 1xht buying');
		console.log(' Step # | name | target | value');
		await sleep(15000);
		await driver.manage().window().maximize() ;
		console.log(' Test name: smartTrade');
		console.log(' Step # | name | target | value');
		console.log(' 1 | open | /trade/xht-usdt | ');
		await driver.get(website+ 'trade/xht-usdt');
		await sleep(5000);
		//itrating on elms
		let elms = await driver.findElements(By.className("f-1 trade_orderbook-cell trade_orderbook-cell_total pointer"));
		for (var elm in elms){}
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		console.log(' 2 | click | css=.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		await sleep(5000);
		console.log(' 2 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		console.log(' 3 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		console.log(' 4 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		console.log(' 5 | click | css=.text-center:nth-child(1) | ');
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		console.log(' 6 | click | name=size | ');
		await driver.findElement(By.name('size')).click();
		console.log(' 7 | type | name=size | 1');
		await driver.findElement(By.name('size')).clear();
		await driver.findElement(By.name('size')).sendKeys('1');
		console.log(' 8 | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		console.log(' 9 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		console.log(' 10 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		console.log(' 11 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 12 | click | css=.notification-content-information > .d-flex:nth-child(1) | ');
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		console.log(' 13 | verifyText | css=.text-capitalize | Market Buy');
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Buy');
		console.log(' 14 | click | css=.notification-content-information > .d-flex:nth-child(2) | ');
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2)')).click();
		console.log(' 15 | verifyText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT');
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		console.log(' 16 | click | css=.d-flex > .holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		hollaTime.Hollatimestampe();
		console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));
		console.log(' 17 | click | css=.trade-col_action_wrapper > .f-1 | ');
		await sleep(3000);
		await driver.findElement(By.css('.trade-col_action_wrapper > .f-1')).click();
		await sleep(3000);
		console.log(' 18 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
		//console.log(' 20 | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		console.log(' 19 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		console.log(' 20 echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

  
	
		await driver.get(website + 'transactions' );
		await driver.manage().window().maximize() ;
		await sleep(7000);
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
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .buy')).getText();
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
		expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());

		await sleep(5000);
		// 1 | open | /trade/xht-usdt | 
		await driver.get(website+"trade/xht-usdt");
		await sleep (5000);
		// 2 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime
		vars["LiveSaleTime"] = await driver.findElement(By.css(".display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row")).getText();
		// 3 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | 
		await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).click();
		// 4 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime
		vars["ActivityOrderTime"] = await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).getText();
		console.log(" Activity order time : "+vars["ActivityOrderTime"]+"Live sale time : "+vars["LiveSaleTime"] );
		console.log("Time should be : "+hollaTime.getHollaTime());
		expect(vars["LiveSaleTime"] ).to.equal(hollaTime.getHollaTime());
		expect(vars["ActivityOrderTime"]).to.equal(hollaTime.GetHollatimestampe());
 
	}); 
	it('market sell', async function(){
		await driver.manage().window().maximize() ;
		await sleep(2000);
		// 3 | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container | 
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		// 4 | click | name=Search Assets | 
		await driver.findElement(By.name('Search Assets')).click();
		// 5 | type | name=Search Assets | xht
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		// 6 | sendKeys | name=Search Assets | ${KEY_ENTER}
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		// 9 | click | css=.highcharts-background | 
		await driver.findElement(By.css('.highcharts-background')).click();
		// 10 | click | css=.text-center:nth-child(1) | 
		await sleep(5000);
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		// 4 | click | css=.holla-button-font:nth-child(2) | 
		await driver.findElement(By.css('.holla-button-font:nth-child(2)')).click();
		// 5 | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) | 
		await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		await sleep(2000);
		// // 11 | click&type 1 | name=size | 
		await driver.findElement(By.name('size')).click();
		await driver.findElement(By.name('size')).sendKeys('1');
		// 6 | click | css=.holla-button | 

		console.log(' 2 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		console.log(' 3 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		console.log(' 4 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
		console.log(' 9 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		console.log(' 10 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		console.log(' 11 | click | css=.holla-button | ');


		await driver.findElement(By.css('.holla-button')).click();
		// 7 | click | css=.text-capitalize | 
		await driver.findElement(By.css('.text-capitalize')).click();
		// 8 | assertText | css=.text-capitalize | Market Sell
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Sell');
		// 9 | click | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).click();
		// 10 | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		// 11 | click | css=.d-flex > .holla-button:nth-child(3) | 
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();

		
		hollaTime.Hollatimestampe();
		console.log("Timestamp : "+String(hollaTime.GetHollatimestampe()));
        //   
		console.log(' 18 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
		//console.log(' 20 | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		console.log(' 19 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		console.log(' 20 echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

        // 	
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

		await sleep(2000);
		// 1 | open | /trade/xht-usdt | 
		await driver.get(website+"trade/xht-usdt");
		await sleep (5000);
		// 2 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime
		vars["LiveSaleTime"] = await driver.findElement(By.css(".display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row")).getText();
		// 3 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | 
		await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).click();
		// 4 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime
		vars["ActivityOrderTime"] = await driver.findElement(By.css(".trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)")).getText();
		console.log(" Activity order time : "+vars["ActivityOrderTime"]+"Live sale time : "+vars["LiveSaleTime"] );
		expect(vars["LiveSaleTime"] ).to.equal(hollaTime.getHollaTime());
		expect(vars["ActivityOrderTime"]).to.equal(hollaTime.GetHollatimestampe());

	}); 
  
});
