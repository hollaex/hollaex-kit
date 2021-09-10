//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
console.log('****************************************');
console.log('This E2E test developed for Hollaex-kit"');
console.log('****************************************');

console.log('*****************');
console.log('Login and log out');
console.log('****************');
require('./Onboarding/login.js');
require('./Onboarding/logout.js');

console.log('***************');
console.log('signUp New user');
console.log('***************');
require('./Onboarding/Signup.js');

console.log('*************');
console.log('Reset Stories');
console.log('*************');
require('./Onboarding/ResetPassword.js');
require('./Onboarding/ResendVerificationEmail.js');

console.log('*****');
console.log('Trade');
console.log('*****');
require('./Trade/Trade.js');
require('./Trade/TradeWithStop.js');
//require('./trade/cancelOrders.js');

console.log('******');
console.log('Wallet');
console.log('******');
require('./Wallet/TransactionFlow.js');
require('./Wallet/Wallet.js');