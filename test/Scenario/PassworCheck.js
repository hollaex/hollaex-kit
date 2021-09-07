const { LogIn, LogOut, SignUp, ResetPassword, Security, Utils } = require('./Modules')
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
	describe('ResetPassword', function () {
		it('Given a user SignUp', async function() {
			SignUp();
		})
 	it('When a new user change the password', async function() {
			ResetPassword();
    	})
		it('Then a new user log in',  function() {
			
			let userName =  Utils.getNewUser();
			let newPassWord = process.env.NEWPASS;
			let driver =  new Builder().forBrowser('chrome').build();
			driver.manage().window().maximize();
	
			Utils.kitLogIn(driver,userName,newPassWord);
    
		})
	})
	describe('ChangingPaswword', function () {
		it('Changing Password', async function() {
			//Security.Security();
			
		})

	})
})
