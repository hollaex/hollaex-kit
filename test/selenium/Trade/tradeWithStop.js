//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
async function TradeWithStop(){
	const { Builder, By, Key, until } = require('selenium-webdriver');
	const assert = require('assert');
	const { expect } = require('chai');
	const { Console } = require('console');
	const hollaTime = require('../Utils/time');
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
	let step = util.getStep()
	describe('Trade with stop', function() {
		this.timeout(300000);
		let driver;
		let vars;
		function sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		} 
		beforeEach(async function() {
			driver = await new Builder().forBrowser(browser).build();
			vars = {};
		
			driver.manage().window().maximize();
			await util.kitLogIn(driver, userName,passWord);
			await sleep(5000);
		
			console.log(step++,' | click | css=.app-menu-bar-content:nth-child(2) .edit-wrapper__container |  | ');
			await driver.findElement(By.css('.app-menu-bar-content:nth-child(2) .edit-wrapper__container')).click();
		
			console.log(step++,'  | click | name=Search Assets |  | ');
			await driver.findElement(By.name('Search Assets')).click();
		
			console.log(step++,'  | type | name=Search Assets | xht | ');
			await driver.findElement(By.name('Search Assets')).sendKeys('xht');
		
			console.log(step++,'  | sendKeys | name=Search Assets | ${KEY_ENTER} | ');
			await driver.findElement(By.name('Search Assets')).sendKeys(Key.ENTER);
		
			console.log(step++,'  | click | css=.trade_tab-pair-sub-title |  | ');
			await driver.findElement(By.css('.trade_tab-pair-sub-title')).click();
		
			console.log(step++,'  | click | name=size |  | ');
			await sleep(3000);
 
			console.log(step++,' .ant-select-selection-item |');
  		await driver.findElement(By.css('.w-100 .ant-select-selection-item')).click();
			await sleep(1000);
		
			// xpath of stop '/html/body/div[11]/div/div/div/div[2]/div[1]/div/div/div[2]/div'
			console.log(step++,' | click | xpath=/html/body/div[11]/div/div/div/div[2]/div[1]/div/div/div[2]/div | xpath of stop');
			await driver.findElement(By.xpath('/html/body/div[11]/div/div/div/div[2]/div[1]/div/div/div[2]/div')).click();
			await sleep(5000);
		});
		afterEach(async function() {
			util.setStep(step);
			await driver.quit();
		});
		it('Limit Buy', async function() {

			console.log(step++,' | click | css=.holla-button-font:nth-child(1| ');
			await driver.findElement(By.css('.holla-button-font:nth-child(1)')).click();
			await sleep(1000);
		
			console.log(step++,'  | click | name=stop| ');
			await driver.findElement(By.name('stop')).click();
		
			console.log(step++,' | type | name=stop | 1');
			await driver.findElement(By.name('stop')).sendKeys('1.1');
			await sleep(1000);

			console.log(step++,' | type | name=price | 0.9');
			// await sleep(1000)
		
			console.log(step++,'  | click | name=size | ');
			await driver.findElement(By.name('size')).click();
		
			console.log(step++,' | type | name=size | 1');
			await driver.findElement(By.name('size')).sendKeys('1');
			await sleep(3000);

			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
			vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
			console.log(step++,' | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
			vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
			console.log(step++,'  | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
			console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
			console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
	    
			console.log(step++,'  | storeValue | name=stop | TriggerPrice');
			vars['TriggerPrice'] = await driver.findElement(By.name('stop')).getAttribute('value');
		
			console.log(step++,'  | echo | ${TriggerPrice} | ');
			console.log('Stop is : '+vars['TriggerPrice']);

			console.log(step++,'  | Enter | name=size| ');
			await driver.findElement(By.name('size')).sendKeys(Key.ENTER);
    
			console.log(step++,'  | assertText | css=.text-capitalize | Limit Buy');
			assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Limit Buy');
		
			console.log(step++,' | click | css=.notification-content-information > .d-flex:nth-child(2) | ');
			await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2)')).click();
		
			console.log(step++,' | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT');
			assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
			console.log(step++,' | click | css=.notification-content-information > .d-flex:nth-child(3) | ');
			await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3)')).click();
		
			console.log(step++,' | assertText | css=.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2) | 0.9 USDT');
			assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2)')).getText() == '1 USDT');
			await sleep(2000);

			console.log(step++,' | click | css=.d-flex > .holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
			util.hollatimestamp();
			console.log('Timestamp : '+String(util.getHollatimestamp()));
		
			console.log(step++,' | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
			vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
			let EstimatedPrice = parseFloat(vars['USDT']);
			console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
			console.log(step++,'  | echo | ${USDT} | ');
			console.log(vars['USDT']);
		   
			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
			vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
			console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
			//console.log(step++,' | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
			//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		
			console.log(step++,'  | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
			vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		
			console.log(step++,'  | echo | ${XHTAFTER} | ');
			console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
			console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
			console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));
		
			console.log(step++,'  | open | /transactions | ');
			await driver.get(website + 'transactions' );
			await sleep(10000);
			//await driver.findElement(By.css(".trade_block-wrapper:nth-child(2) .action_notification-text")).click()
   
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp');
			vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > .text-uppercase | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair');
			vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();

			console.log(step++,' | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) .buy | side');
			vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .buy')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size');
			vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price');
			vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount');
			vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee');
			vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
			console.log(step++,'  | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ');
			console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
			console.log(vars['timestamp']+' should be '+util.getHollatimestamp());
			await sleep(2000);
			//expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());
		
			console.log(step++,'  | open | /trade/xht-usdt | ');
			await driver.get(website+'trade/xht-usdt');
			await sleep (5000);
		
			console.log(step++,' | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime ');
			vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
			console.log(step++,' | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,' | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime');
			vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
			console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
			expect(vars['LiveSaleTime'] ).to.equal(util.getHollaTime());
			expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());

			console.log('This is the EndOfTest');
		});

		it('Limit sell', async function(){


			console.log('Test name: Limit Sell');
			console.log('Step # | name | target | value');
		
			console.log(step++,' | click | css=.holla-button-font:nth-child(2) | ');
			await driver.findElement(By.css('.holla-button-font:nth-child(2)')).click();
		
			console.log(step++,' | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) | ');
			await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		
			console.log(step++,'  | storeValue | name=price | value ');
			let value = await driver.findElement(By.name('price')).getAttribute('value');
	
			console.log(step++,'  | click | name=stop | ');
			await driver.findElement(By.name('stop')).click();
		
			console.log(step++,' | type | name=stop | value - 0.01');
			await driver.findElement(By.name('stop')).sendKeys(0.8);
		
			console.log(step++,'  | click | name=size | ');
			await driver.findElement(By.name('size')).click();
			await driver.findElement(By.name('size')).sendKeys(1);
	
		
		
			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
			vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
			console.log(step++,' | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
			vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
			console.log(step++,'  | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
			console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
			console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
			console.log(step++,'  | storeValue | name=stop | TriggerPrice');
			vars['TriggerPrice'] = await driver.findElement(By.name('stop')).getAttribute('value');
		
			console.log(step++,'  | echo | ${TriggerPrice} | ');
			console.log('Stop is : '+vars['TriggerPrice']);
		
			console.log(step++,' | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
			vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
			let EstimatedPrice = parseFloat(vars['USDT']);
			console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
			console.log(step++,'  | echo | ${USDT} | ');
			console.log(vars['USDT']);
		
			console.log(step++,'  | Enter | name=size |  ');
			await driver.findElement(By.name('size')).sendKeys(Key.ENTER);
		
			console.log(' 8 | type | name=stop | 0.8');
			//await driver.findElement(By.name("stop")).sendKeys("0.8")
		
			console.log(step++,' | click | css=.notification-content-information > .d-flex:nth-child(1) | ');
			await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		
			console.log(step++,' | assertText | css=.d-flex:nth-child(1) > .text_disabled | Food type:');
			assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Limit Sell');
		
			console.log(step++,' | click | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | ');
			await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).click();
		
			console.log(step++,' | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT');
			assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
			console.log(step++,' | click | css=.notification-content-information > .d-flex:nth-child(3) | ');
			await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3)')).click();
		
			console.log(step++,' | assertText | css=.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2) | 0.9 USDT');
			//assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(3) > .f-1:nth-child(2)')).getText() == '0.9 USDT');
		
			console.log(step++,' | click | css=.d-flex > .holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();

			util.hollatimestamp();
			console.log('Timestamp : '+String(util.getHollatimestamp()));
			//
			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
			vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
			console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
			//console.log(step++,' | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		
	   console.log(step++,'  | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
			vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		
			console.log(step++,'  | echo | ${XHTAFTER} | ');
			console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
			console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
			console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));
		
			console.log(step++,'  | open | /transactions | ');
			await driver.get(website + 'transactions' );
			await sleep(10000);
			//await driver.findElement(By.css(".trade_block-wrapper:nth-child(2) .action_notification-text")).click()
   
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp');
			vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > .text-uppercase | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair');
			vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) .buy | side');
			//vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .sell')).getText()
			vars['side'] ='sell';
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size');
			vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price');
			vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount');
			vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee');
			vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
			console.log(step++,'  | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ');
			console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
			console.log(vars['timestamp']+' should be '+util.getHollatimestamp());
			//expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());
			await sleep(2000);
		
			console.log(step++,'  | open | /trade/xht-usdt | ');
			await driver.get(website+'trade/xht-usdt');
			await sleep (5000);
		
			console.log(step++,' | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime');
			vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
			console.log(step++,' | click | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,' | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime');
			vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
			console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
			expect(vars['LiveSaleTime'] ).to.equal(util.getHollaTime());
			expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());
		
			console.log('This is the EndOfTest');
		});

		it('Market Buy', async function(){
		
			console.log(step++,' | click | css=.text-center:nth-child(1) | ');
			await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		
			console.log(step++,' | click | css=.holla-button-font:nth-child(1)| ');
			await driver.findElement(By.css('.holla-button-font:nth-child(1)')).click();
		
			console.log(step++,'  | click | name=stop | ');
			await driver.findElement(By.name('stop')).click();
		
			console.log(step++,' | type | name=stop | 1');
			await driver.findElement(By.name('stop')).sendKeys('1.1');
		
			console.log(step++,'  | click | name=size | ');
			await driver.findElement(By.name('size')).click();
		
			console.log(step++,' | type | name=size | 1');
			await driver.findElement(By.name('size')).sendKeys('1');
		
			console.log(step++,'  | sendKeys | name=size | ${KEY_ENTER}');
			await driver.findElement(By.name('size')).sendKeys(Key.ENTER);

			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
			vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
			console.log(step++,' | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
			vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
			console.log(step++,' | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
			console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
			console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
			console.log(step++,' | storeValue | name=stop | TriggerPrice');
			vars['TriggerPrice'] = await driver.findElement(By.name('stop')).getAttribute('value');
		
			console.log(step++,'  | echo | ${TriggerPrice} | ');
			console.log('Stop is : '+vars['TriggerPrice']);
	
			console.log(step++,' | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
			vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
			let EstimatedPrice = parseFloat(vars['USDT']);
			console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
			console.log(step++,'  | echo | ${USDT} | ');
			console.log(vars['USDT']);
		
			console.log(step++,' | click | css=.notification-content-information > .d-flex:nth-child(1) | ');
			await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		
			console.log(step++,'  | assertText | css=.text-capitalize | Market Buy');
			assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Buy');
		
			console.log(step++,' | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT');
			assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
			console.log(step++,' | click | css=.d-flex > .holla-button:nth-child(3) | ');
			await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		
			console.log('This is the EndOfTest');
		});
    
		it('Market Sell', async function(){
    
			console.log(step++,' | click | css=.text-center:nth-child(1) |  | ');
			await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		
			console.log(step++,' | click | css=.holla-button-font:nth-child(2) |  | ');
			await driver.findElement(By.css('.holla-button-font:nth-child(2)')).click();
		
			console.log(step++,' | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) |  | ');
			await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		
			console.log(step++,'  | click | name=stop|  | ');
 		await driver.findElement(By.name('stop')).click();
		
		 console.log(step++,' | type | name=stop | 0.8 | ');
			await driver.findElement(By.name('stop')).sendKeys('0.8');
		
			console.log(step++,' | click| name=size | 1 | ');
			await driver.findElement(By.name('size')).click();
		
			console.log(step++,' | type | name=size | 1 | ');
			await driver.findElement(By.name('size')).sendKeys('1');
	
			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
			vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		
			console.log(step++,' | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
			vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		
			console.log(step++,'  | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
			console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
			console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		
			console.log(step++,'  | storeValue | name=stop | TriggerPrice');
			vars['TriggerPrice'] = await driver.findElement(By.name('stop')).getAttribute('value');
		
			console.log(step++,'  | echo | ${TriggerPrice} | ');
			console.log('Stop is : '+vars['TriggerPrice']);
				
			console.log(step++,' | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
			vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
			let EstimatedPrice = parseFloat(vars['USDT']);
			console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		
			console.log(step++,'  | echo | ${USDT} | ');
			console.log(vars['USDT']);
	    
			console.log(step++,'  | sendKeys | name=size | ${KEY_ENTER} | ');
	    await driver.findElement(By.name('size')).sendKeys(Key.ENTER);
			await sleep(2000);
		
			console.log(step++,'  | verifyText | css=.text-capitalize | Market Sell | ');
			assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Sell');
		
			console.log(step++,' | assertText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT | ');
			assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		
			console.log(step++,' | click | css=.d-flex > .holla-button:nth-child(3) |  | ');
			await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		
			util.hollatimestamp();
			console.log('Timestamp : '+String(util.getHollatimestamp()));
		
			console.log(step++,' | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
			vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
			let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
			console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
			//console.log(step++,' | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		
	   console.log(step++,' | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
			vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
			let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		
			console.log(step++,'  | echo | ${XHTAFTER} | ');
			console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
			console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
			console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

			console.log(step++,'  | open| /transactions | ');
			await driver.get(website + 'transactions' );
			await sleep(10000);
			//await driver.findElement(By.css(".trade_block-wrapper:nth-child(2) .action_notification-text")).click()
   
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp');
			vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > .text-uppercase | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair');
			vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) .buy | side');
			//vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .sell')).getText()
			vars['side'] ='sell';
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size');
			vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price');
			vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount');
			vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText();
		
			console.log(step++,' | click | css=.table_body-row:nth-child(1) | ');
			await driver.findElement(By.css('.table_body-row:nth-child(1)')).click();
		
			console.log(step++,' | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee');
			vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText();
		
			console.log(step++,' | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | ');
			console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee']);
			console.log(vars['timestamp']+' should be '+util.getHollatimestamp());
			//expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());
			await sleep(2000);

			console.log(step++,'  | open | /trade/xht-usdt | ');
			await driver.get(website+'trade/xht-usdt');
			await sleep (5000);

			console.log(step++,' | storeText | css=.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row | LiveSaleTime');
			vars['LiveSaleTime'] = await driver.findElement(By.css('.display_table-cell:nth-child(1) > .f-1:nth-child(3) > .trade_history-row')).getText();
		
			console.log(step++,' ) | ');
			await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).click();
		
			console.log(step++,' | storeText | css=.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4) | ActivityOrderTime');
			vars['ActivityOrderTime'] = await driver.findElement(By.css('.trade_block-wrapper:nth-child(1) .table_body-row:nth-child(1) > td:nth-child(4)')).getText();
			console.log(' Activity order time : '+vars['ActivityOrderTime']+'Live sale time : '+vars['LiveSaleTime'] );
			expect(vars['LiveSaleTime'] ).to.equal(util.getHollaTime());
			expect(vars['ActivityOrderTime']).to.equal(util.getHollatimestamp());

			console.log('This is the EndOfTest');
		});
	});
}
describe('Main Test', function () {
 
//	TradeWithStop();
})
module.exports.TradeWithStop = TradeWithStop ;