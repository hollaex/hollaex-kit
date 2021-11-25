//This scenario check for a new user to reset the password and check changing passwords
const AccountLevel = require('../Onboarding/AccountLevel');
const { Kyc } = require('../Roles/Kyc');
const { Supervisor } = require('../Roles/Supervisor');
const { CancelOrders } = require('../Trade/CancelOrders');
const { QuickTrade } = require('../Trade/QuickTrade');
const { TransactionFlow } = require('../Wallet/TransactionFlow');
const { LogIn, LogOut, SignUp, ResetPassword, Security, Utils, ResendVerificationEmail,ReCAPTCHA, Referral, Setting, Verification, CancelOrder, Promotion, Communicator, Trade, Support, Wallet} = require('./Modules')
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
	describe('test', function () {
			it('test is..', async function() {
				//   await SignUp.SignUp()
				//  AccountLevel()
				//  LogIn.LogIn();
				// LogOut.LogOut();
				//  Promotion.Promotion()
				// ReCAPTCHA.ReCAPTCHA()
				// Referral.Referral()
				// ResendVerificationEmail.ResendVerificationEmail() 
				// ResetPassword.ResetPassword()
				//  Security.Security()
				//  Setting.Setting()
				
				//  Verification.Verification();//failed
				/*Roles*/
				//  Communicator.Communicator()
				//  Kyc()
				// Supervisor()
				// Support.Support()
				// /*Trade*/
				// CancelOrder.CancelOrder()
				// CancelOrders()
				//QuickTrade()
				//  Trade.Trade()
				// TradeWithStop.TradeWithStop()
				// /*Wallet*/
				// TransactionFlow()
				//   Wallet.Wallet();
				
				
		})
	})

})
