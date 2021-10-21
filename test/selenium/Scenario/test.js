//this scenario test Plug ins
//const { util } = require('chai');
const util = require ('./../Utils/Utils.js');
const {  AccountLevel, LogIn, Promotion, LogOut, Referral, Security, Trade } = require('./Modules')
const { Builder, By, Key, until } = require('selenium-webdriver');
const { spawn } = require("child_process");
const { TransactionFlow } = require('../Wallet/TransactionFlow.js');

// const ls = spawn("ls", ["-la"]);

// ls.stdout.on("data", data => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", data => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('error', (error) => {
//     console.log(`error: ${error.message}`);
// });

// ls.on("close", code => {
//     console.log(`child process exited with code ${code}`);
// });
describe('Main Test', function () {
	this.timeout(3000000);
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	afterEach(function() {
		
		sleep(5000);
		util.setStep(1)
	   //await driver.quit();
   })
   beforeEach(function() {
		
	sleep(5000);
	 //await driver.quit();
})
	
	describe('plug in', function () {
		afterEach(function() {
			// util.setStep(util.getStep())
			// console.log("after",util.getStep())
			// sleep(5000);
		   //await driver.quit();
	   })
	   beforeEach(function() {
			
		// sleep(5000);
		// console.log("befor",util.getStep())
	   //await driver.quit();
	})
		
	it('promotion',async function() {
			
			
			
		   

			
			
	})
	

		})
		
	
})