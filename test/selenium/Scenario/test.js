//This scenario check for a new user to reset the password and check changing passwords
const { LogIn, LogOut, SignUp, ResetPassword, Security, Utils, ResendVerificationEmail,ReCAPTCHA} = require('./Modules')
const { Builder, By, Key, until } = require('selenium-webdriver')-
Utils.setStep(1)
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
			it('and the user change pasword securely', async function() {
			Security.Security();
			
		})
	})

})
