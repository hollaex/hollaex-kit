//this scenario test Plug ins
//const { util } = require('chai');
const util = require ('./../Utils/Utils.js');
const {  AccountLevel, LogIn, Promotion, LogOut } = require('./Modules')
const { Builder, By, Key, until } = require('selenium-webdriver')-

describe('Main Test', function () {
	this.timeout(3000000);
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	afterEach(async function() {
		
		await sleep(5000);
		//await driver.quit();
	})
	
	describe('log-in-out', function () {
		it('log-in', async function() {
			//Promotion.Promotion()
			util.setStep(1)
			await LogIn.LogIn();
			console.log(util.getStep())
			
	})
	
	it('log-in', async function() {
		await LogOut.LogOut();
		console.log(util.getStep())
		
})
	
		})
		
	
})