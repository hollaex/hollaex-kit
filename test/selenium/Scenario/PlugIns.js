//this scenario test Plug ins

const {  AccountLevel, Promotion, Referral,Utils } = require('./Modules')
const { Builder, By, Key, until } = require('selenium-webdriver')
Utils.setStep(1);
describe('Main Test', function () {
	this.timeout(3000000);
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	afterEach(async function() {
		await sleep(5000);
		await driver.quit();
	})
	describe('PlugIn', function () {
		it('Promotion', async function() {
			Promotion.Promotion()
		})
		it('Referral', async function() {
			
			Referral.Referral()
        
		})

	
	})
})
