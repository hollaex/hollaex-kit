//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
console.log('****************************************');
console.log('This E2E test developed for Hollaex-kit"');
console.log('****************************************');

console.log('*****************');
console.log('Login and log out');
console.log('****************');
require('./onboarding/logIn.js');
require('./onboarding/logOut.js');

console.log('***************');
console.log('signUp New user');
console.log('***************');
require('./onboarding/signUp.js');

console.log('*************');
console.log('Reset Stories');
console.log('*************');
require('./onboarding/resetPassword.js');
require('./onboarding/resendVerificationEmail.js');

console.log('*****');
console.log('Trade');
console.log('*****');
require('./trade/trade.js');
require('./trade/tradeWithStop.js');
//require('./trade/cancelOrders.js');

console.log('******');
console.log('Wallet');
console.log('******');
require('./wallet/DW_flow.js');
require('./wallet/wallet.js');