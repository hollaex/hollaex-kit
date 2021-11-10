module.exports = {
AccountLevel : require('../Onboarding/AccountLevel'),
LogIn : require('../Onboarding/LogIn'),
LogOut : require('../Onboarding/LogOut.js'),
Promotion : require('../Onboarding/Promotion.js'),
ReCAPTCHA : require('../Onboarding/reCAPTCHA.js'),
Referral : require('../Onboarding/Referral.js'),
ResendVerificationEmail : require('../Onboarding/ResendVerificationEmail.js'),
ResetPassword : require('../Onboarding/ResetPassword.js'),
Security : require('../Onboarding/Security.js'),
Setting : require('../Onboarding/Setting.js'),
SignUp : require('../Onboarding/SignUp.js'),
Verification : require('../Onboarding/Verification.js'),
/*Roles*/
Communicator : require('../Roles/Communicator.js'),
Kyc : require('../Roles/Kyc.js'),
Supervisor : require('../Roles/Supervisor.js'),
Support: require('../Roles/Support.js'),
/*Trade*/
CancelOrder : require('../Trade/CancelOrder.js'),
CancelOrders : require('../Trade/CancelOrders.js'),
QuickTrade : require('../Trade/QuickTrade.js'),
SmartTrade : require('../Trade/SmartTrade.js'),
Trade: require('../Trade/Trade.js'),
TradeWithStop: require('../Trade/TradeWithStop.js'),
/*Wallet*/
DWflow : require('../Wallet/TransactionFlow.js'),
Wallet : require('../Wallet/Wallet.js'),
/*Utiles*/
Utils : require ('./../Utils/Utils.js')
 }