//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
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
		await driver.manage().window().maximize();
		await util.kitLogIn(driver, userName,passWord);
	
	});
	afterEach(async function() {
	//  await driver.quit();
	});
	it('limit buy', async function() {

		console.log(' 7 | click | css=..app-menu-bar-content:nth-child(2) .edit-wrapper__container|  |  ')
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		
		console.log(' 8 | click | name=Search Assets |  |  ')
		await driver.findElement(By.name('Search Assets')).click();
		
		console.log(' 9 | type | name=Search Assets | xht | ')
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		
		console.log(' 10 | sendKeys | name=Search Assets | ${KEY_ENTER} | ')
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		
		console.log(' 11 | click | css=.trade_tab-pair-sub-title |  |  ')
		await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		await sleep(3000);

		console.log(' 12 | click | name=size |  |  ')
		await driver.findElement(By.name('size')).click();
		
		console.log(' 13 | type | name=size | 1 | ')
		await driver.findElement(By.name('size')).sendKeys('1');
		await sleep(5000);
		
		console.log(' 14 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
		console.log(' 15 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
		console.log(' 16 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
		console.log(' 17 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
		console.log(' 18 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		
		console.log(' 19 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();

		console.log(' 20 | click | css=.notification-content-information > .d-flex:nth-child(1) |  |  ')
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		
		console.log(' 21 | assertText | css=.text-capitalize | Limit Buy | ')
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Limit Buy');
		
		console.log(' 22 | click | css=.d-flex > .holla-button:nth-child(3) |  |  ')
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		
		console.log(' 23 | click | css=.w-100 .ant-select-selection-item |  |  ')
		util.hollatimestamp();
		console.log('Timestamp : '+String(util.getHollatimestamp()));
		
		console.log(' 24 | click | css=.w-100 .ant-select-selection-item |  |  ')
		await driver.findElement(By.css('.w-100 .ant-select-selection-item')).click();
		
		console.log(' 25 | click | css=.ant-select-item-option-active > .ant-select-item-option-content |  |  ')
		await driver.findElement(By.css('.ant-select-item-option-active > .ant-select-item-option-content')).click();
		
		console.log(' 26 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
	
		console.log(' 27 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);

		console.log(' 28 | echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

        // wallet check
	
		console.log(' 29 | open | /transactions | ')
		await driver.get(website + 'transactions' );
		await sleep(10000);
		
   
		console.log(' 30 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
		console.log(' 31 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp')
		vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
		console.log(' 32 | click | css=.table_body-row:nth-child(1) > .text-uppercase | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
		console.log(' 33 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair')
		vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
		console.log(' 34 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 35 | storeText | css=.table_body-row:nth-child(1).buy | side')
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1).buy')).getText();
		
		console.log(' 36 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
		console.log(' 37 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size')
		vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
		console.log(' 38 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 39 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price')
		vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
		console.log(' 40 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
		console.log(' 41 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount')
		vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
		console.log(' 42 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 43 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee')
		vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
		console.log(' 44 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ')
		console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
		console.log(vars['timestamp']+' should be '+util.getHollatimestamp());
		expect(vars['timestamp']).to.equal(util.getHollatimestamp());
		await sleep(2000);  
		
		console.log(' 45 | open | /trade/xht-usdt | ')
		await driver.get(website+'trade/xht-usdt');
		await sleep (5000);

		console.log(' 46 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime')
		vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
		console.log(' 47 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 48 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime')
		vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
		expect(vars['LiveSaleTime'] ).to.equal(util.getHollatimestamp());
		expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());
		
		console.log('This is the EndOfTest');

	});

	it('Limit Sell', async function() {

		console.log(' 7 | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container | ')
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		
		console.log(' 8 | click | name=Search Assets | ')
		await driver.findElement(By.name('Search Assets')).click();
		
		console.log(' 9 | type | name=Search Assets | xht')
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		
		console.log(' 10 | sendKeys | name=Search Assets | ${KEY_ENTER}')
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		
		console.log(' 11 | click | css=.highcharts-background | ')
		await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		await sleep(4000);
		
		console.log(' 12 | click | css=.holla-button-font:nth-child(2) | ')
		await driver.findElement(By.css('.holla-button-font:nth-child(2)')).click();
		
		console.log(' 13 | click | name=size | ')
		await driver.findElement(By.name('size')).click();
		
		console.log(' 14 | type | name=size | 1')
		await driver.findElement(By.name('size')).sendKeys('1');
		
		console.log(' 15 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
		console.log(' 16 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
		console.log(' 17 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
		console.log(' 18 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
		console.log(' 19 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		
		console.log(' 20 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		
		console.log(' 21 | click | css=.text-capitalize | ')
		await driver.findElement(By.css('.text-capitalize')).click();
		
		console.log(' 22 | assertText | css=.text-capitalize | Limit Sell')
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Limit Sell');
		
		console.log(' 23 | click | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | ')
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).click();
		
		console.log(' 24 | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT')
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
		console.log(' 25 | click | css=.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2) | ')
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2)')).click();
		
		console.log(' 26 | assertText | css=.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2) | 1 USDT')
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2)')).getText() == '1 USDT');
		
		console.log(' 27 | click | css=.d-flex > .holla-button:nth-child(3) | ')
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();

		hollaTime.Hollatimestampe();
		console.log('Timestamp : '+String(util.getHollatimestamp()));


		console.log(' 28 | click | css=.table_body-row:nth-child(1) .action_notification-text | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) .action_notification-text')).click();

		console.log(' 29 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
		
		console.log(' 19 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		
		console.log(' 30 | echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

        console.log(' 31 | open | /transactions | ')
		await driver.get(website + 'transactions' );
		await sleep(10000);
		   
		console.log(' 32 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
		console.log(' 33 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp')
		vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
		console.log(' 34 | click | css=.table_body-row:nth-child(1) > .text-uppercase | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
		console.log(' 35 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair')
		vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
		console.log(' 36 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 37 | storeText | css=.table_body-row:nth-child(1).buy | side')
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1).buy')).getText();
		
		console.log(' 38 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
		console.log(' 39 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size')
		vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
		console.log(' 40 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 41 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price')
		vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
		console.log(' 42 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
		console.log(' 43 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount')
		vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
		console.log(' 44 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 45 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee')
		vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
		console.log(' 46 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ')
		console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
		console.log(vars['timestamp']+' should be '+hollaTime.GetHollatimestampe());
		expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());

		await sleep(2000);
		console.log(' 47 | open | /trade/xht-usdt | ');
		await driver.get(website+'trade/xht-usdt');
		await sleep (5000);

		console.log(' 48 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime')
		vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
		console.log(' 49 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 50 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime')
		vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
		expect(vars['LiveSaleTime'] ).to.equal(util.getHollaTime());
		expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());

		console.log('This is the EndOfTest');
	});

	it('Market buy', async function(){
		console.log(' Test name: 1xht buying');
		console.log(' Step # | name | target | value');
		await sleep(15000);
		
		console.log(' 7 | open | /trade/xht-usdt | ');
		await driver.get(website+ 'trade/xht-usdt');
		await sleep(5000);
		
		let elms = await driver.findElements(By.className('f-1 trade_orderbook-cell trade_orderbook-cell_total pointer'));
		for (var elm in elms){}
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		
		console.log(' 8 | click | css=.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		await sleep(5000);
		
		console.log(' 9 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
		console.log(' 10 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
		console.log(' 11 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
		console.log(' 12 | click | css=.text-center:nth-child(1) | ');
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		
		console.log(' 13 | click | name=size | ');
		await driver.findElement(By.name('size')).click();
		
		console.log(' 14 | type | name=size | 1');
		await driver.findElement(By.name('size')).clear();
		await driver.findElement(By.name('size')).sendKeys('1');
		
		console.log(' 15 | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		
		console.log(' 16 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
		console.log(' 17 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		
		console.log(' 18 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();

		console.log(' 19 | click | css=.notification-content-information > .d-flex:nth-child(1) | ');
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		
		console.log(' 20 | verifyText | css=.text-capitalize | Market Buy');
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Buy');
		
		console.log(' 21 | click | css=.notification-content-information > .d-flex:nth-child(2) | ');
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2)')).click();
		
		console.log(' 22 | verifyText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT');
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
		console.log(' 23 | click | css=.d-flex > .holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		util.hollatimestamp();
		console.log('Timestamp : '+String(util.getHollatimestamp()));
		await sleep(3000);

		console.log(' 24 | click | css=.trade-col_action_wrapper > .f-1 | ');
		await driver.findElement(By.css('.trade-col_action_wrapper > .f-1')).click();
		await sleep(3000);
		
		console.log(' 25 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
	
		console.log(' 26 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		
		console.log(' 27 | echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

  
		console.log(' 28 | open | /trade/xht-usdt | ');
		await driver.get(website + 'transactions' );
		await sleep(7000);
	   
		console.log(' 29 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
		console.log(' 30 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp')
		vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
		console.log(' 31 | click | css=.table_body-row:nth-child(1) > .text-uppercase | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
		console.log(' 32 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair')
		vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
		console.log(' 33 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 34 | storeText | css=.table_body-row:nth-child(1) .buy | side')
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .buy')).getText();
		
		console.log(' 35 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
		console.log(' 36 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size')
		vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
		console.log(' 37 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 38 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price')
		vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
		console.log(' 39 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
		console.log(' 40 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount')
		vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
		console.log(' 41 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 42 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee')
		vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
		console.log(' 43 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ')
		console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
		expect(vars['timestamp']).to.equal(util.getHollatimestamp());
		await sleep(5000);

		console.log(' 44 | open | /trade/xht-usdt | ')
		await driver.get(website+'trade/xht-usdt');
		await sleep (5000);

		console.log(' 45 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime')
		vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
		console.log(' 46 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 47 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime')
		vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
		console.log('Time should be : '+util.getHollaTime());
		expect(vars['LiveSaleTime'] ).to.equal(util.getHollaTime());
		expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());
		
		console.log('This is the EndOfTest');
	}); 
	it('market sell', async function(){

		console.log(' 7 | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container | ')
		await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		
		console.log(' 8 | click | name=Search Assets | ')
		await driver.findElement(By.name('Search Assets')).click();
		
		console.log(' 9 | type | name=Search Assets | xht')
		await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		
		console.log(' 10 | sendKeys | name=Search Assets | ${KEY_ENTER}')
		await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		
		console.log(' 11 | click | css=.highcharts-background | ')
		await driver.findElement(By.css('.highcharts-background')).click();
		await sleep(5000);

		console.log(' 12 | click | css=.text-center:nth-child(1) | ')
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		
		console.log(' 13 | click | css=.holla-button-font:nth-child(2) | ')
		await driver.findElement(By.css('.holla-button-font:nth-child(2)')).click();
		
		console.log(' 14 | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) | ')
		await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		await sleep(2000);
		
		console.log(' 15 | click&type 1 | name=size | ')
		await driver.findElement(By.name('size')).click();
		await driver.findElement(By.name('size')).sendKeys('1');
		
		console.log(' 16 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
		console.log(' 17 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
		console.log(' 18 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
		console.log(' 19 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
		console.log(' 20 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		
		console.log(' 21 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		
		console.log(' 22 | click | css=.text-capitalize | ')
		await driver.findElement(By.css('.text-capitalize')).click();
		
		console.log(' 23 | assertText | css=.text-capitalize | Market Sell')
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Sell');
		
		console.log(' 24 | click | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | ')
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).click();
		
		console.log(' 25 | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT')
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
		console.log(' 26 | click | css=.d-flex > .holla-button:nth-child(3) | ')
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();

		
		util.hollatimestamp();
		console.log('Timestamp : '+String(util.getHollatimestamp()));
        //   
		console.log(' 27 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
	
		console.log(' 28 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		
		console.log(' 29 | echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

		console.log(' 30 | open | /transactions | ')
		await driver.get(website + 'transactions' );
		await sleep(10000);
	   
		console.log(' 31 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
		console.log(' 32 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp')
		vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
		console.log(' 33 | click | css=.table_body-row:nth-child(1) > .text-uppercase | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
		console.log(' 34 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair')
		vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
		console.log(' 35 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 36 | storeText | css=.table_body-row:nth-child(1) .buy | side')
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .sell')).getText();
		
		console.log(' 37 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
		console.log(' 38 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size')
		vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
		console.log(' 39 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 40 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price')
		vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
		console.log(' 41 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
		console.log(' 42 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount')
		vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
	
		console.log(' 43 | click | css=.table_body-row:nth-child(1) | ')
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
		console.log(' 44 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee')
		vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
		console.log(' 45 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ')
		console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
		console.log(vars['timestamp']+' should be '+util.getHollatimestamp());
		expect(vars['timestamp']).to.equal(util.getHollatimestamp());
		await sleep(2000);
		
		console.log(' 46 | open | /trade/xht-usdt | ')
		await driver.get(website+'trade/xht-usdt');
		await sleep (5000);
		
		console.log(' 47 | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime')
		vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
		console.log(' 48 | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ')
		await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
		console.log(' 49 | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime')
		vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
		expect(vars['LiveSaleTime'] ).to.equal(util.getHollaTime());
		expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());
		
		console.log('This is the EndOfTest');
	}); 
  
});
