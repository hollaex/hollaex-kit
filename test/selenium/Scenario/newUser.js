//This scenario check for a new user to reset the password and check changing passwords
const AccountLevel = require('../Onboarding/AccountLevel');
const { TransactionFlow } = require('../Wallet/TransactionFlow');
const { LogIn, LogOut, SignUp, ResetPassword, Security, Utils, ResendVerificationEmail,ReCAPTCHA, Referral, Promotion, Communicator, Kyc, Supervisor, Support, Trade, TradeWithStop, SmartTrade, Wallet} = require('./Modules')
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
	describe('New user', function () {
		it('Given a ReCAPTCHA works', async function() {
			//ReCAPTCHA.ReCAPTCHA();
		})
		it('Given a user SignUp', async function() {
			SignUp.SignUp();
		})
		it('َAnd the user log in', async function() {
			LogIn.LogIn();
		})
		it('Then the user log out', async function() {
			LogOut.LogOut();
		})
		it('And the user can resend verification', async function() {
			ResendVerificationEmail.ResendVerificationEmail()
		})
 		it('then the new user change the password', async function() {
			ResetPassword.ResetPassword();
    	})
		it('and the user change pasword securely', async function() {
			Security.Security();
			
		})
		it('and the user be a referee', async function() {
			Referral.Referral();
		})
	})
		describe('Admin', function () {
			it('Given admin can change the userlevel', async function() {
				AccountLevel.AccountLevel();
			})
			it('And can change discount rate', async function() {
				Promotion.Promotion();
			})
		})
		describe('Roles', function () {
			it('َGiven communicator can', async function() {
				Communicator.Communicator()
			})
			it('Given KYC can', async function() {
				Kyc.Kyc();
			})
			it('Given supervisor can', async function() {
				Supervisor.Supervisor();
			})
			 it('Given support can', async function() {
				Support.Support();
			})
		})				
	
		// describe('Trading', function () {
		// 	it('َGiven a trade can', async function() {
		// 		Trade.Trade();
		// 	})
		// 	it('And trade with the stop option', async function() {
		// 		TradeWithStop.TradeWithStop();
		// 	})
		// 	it('Then can do smart trade', async function() {
		// 		SmartTrade.SmartTrade();
		// 	})
		// })	
		// describe('Wallet', function () {
		// 	it('َGiven a trader can creat wallet', async function() {
		// 		Wallet.Wallet();
		// 	})
		// 	it('Then can deposit and withdraw', async function() {
		// 		TransactionFlow();
		// 	})
		// })					
})
