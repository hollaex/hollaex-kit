//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Console } = require('console');
const totp = require("totp-generator");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const assert = require('assert');
let logInPage = process.env.LOGIN_PAGE;
let emailPage =process.env.EMAIL_PAGE;
var randomstring = require('randomstring');

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
function defineNewUser(User,i){
	const newUser = randomstring.generate(i)+'@'+User ;
	//console.log(newUser);

	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}
  
	localStorage.setItem('NewUser', newUser);
	//console.log(localStorage.getItem('NewUser'));
	return localStorage.getItem('NewUser');
}
function getNewUser(){
	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	}
  
	return localStorage.getItem('NewUser');
}
async function kitLogIn(driver,userName,passWord){

	//let driver = await new Builder().forBrowser('chrome').build();

	
	//Given User's data
	console.log(' Log in your hollaex Kit	:',userName);
	console.log(logInPage);
	await driver.get(logInPage);
	await driver.sleep(5000);
	const title = await driver.getTitle();
	console.log(title);
	expect(title).to.equal(title);
	console.log('entring', logInPage);
	console.log(' Step # | action | target | value');
    
	console.log(' 1 | type | name=email |', userName);
	await driver.wait(until.elementLocated(By.name('email')), 5000);
	await driver.findElement(By.name('email')).sendKeys(userName);
    
	console.log(' 2 | type | name=password | PASSWORD');
	await driver.wait(until.elementLocated(By.name('password')), 5000);
	await driver.findElement(By.name('password')).sendKeys(passWord);
    
	console.log(' 3 | click | css=.auth_wrapper | ');
	await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.auth_wrapper'))), 5000);
	await driver.findElement(By.css('.auth_wrapper')).click();
	console.log(' 4 | verifyElementPresent | css=.holla-button |'); 
	{
		const elements = await driver.findElements(By.css('.holla-button'));
		// assert(elements.length);
		expect(elements.length);
	}
	//when login    
	console.log(' 5 | click | css=.holla-button | ');
	await driver.findElement(By.css('.holla-button')).click();
	await sleep(5000);
	//then the username should be as same as entered 		
	console.log(' 6 | assertText | css=.app-bar-account-content > div:nth-child(2) |',userName);
	await driver.wait(until.elementLocated(By.css('.app-bar-account-content > div:nth-child(2)')), 20000);
	await console.log(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText());
	expect(await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).getText()).to.equal(userName);
		 
	console.log(' you suceccefully logged in ',userName);



}
async function emailLogIn(driver, emailAdmin,passWord){
	
	// let driver = await new Builder().forBrowser('chrome').build();
	console.log('Entering username and password');
	console.log(emailPage);
	await driver.get(emailPage);
	console.log('2 | setWindowSize | 1280x680 |'); 
	await driver.manage().window().setRect(1280, 680);
	console.log('3 | click | id=wdc_username |');
	await sleep(10000);
	await driver.findElement(By.id('wdc_username')).click();
	console.log('4 | type | id=wdc_username | QA');
	await driver.findElement(By.id('wdc_username')).sendKeys(emailAdmin);
	console.log('5 | click | id=wdc_password | ');
	await driver.findElement(By.id('wdc_password')).click();
	console.log('6 | type | id=wdc_password | Password!');
	await driver.findElement(By.id('wdc_password')).sendKeys(passWord);
	console.log('7 | click | id=wdc_login_button | ');
	await driver.findElement(By.id('wdc_login_button')).click();
	console.log('8 | click | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
	await driver.manage().window().maximize();
	await sleep(10000);
}

async function adminVerifiesNewUser(driver,aUserName,aPassword,newUserName){
	await driver.get(logInPage);
	await sleep(10000);
	// 2 | type | name=email | USER@bitholla.com
	// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
	await driver.findElement(By.name('email')).sendKeys(aUserName);
	// 3 | type | name=password | bitholla@bitholla.com
	//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
	await driver.findElement(By.name('password')).sendKeys(aPassword);
	// 4 | click | name=email | 
   
	await sleep(4000);
	await driver.findElement(By.name('email')).click();
	// 5 | click | css=.holla-button | 
	await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
	await driver.findElement(By.css('.holla-button')).click();
	await driver.manage().window().maximize();
	await sleep(5000);
	// 6 | click | css=a > .pl-1 | 
	await driver.findElement(By.css('a > .pl-1')).click();
	// 7 | click | linkText=Users | 
	await driver.findElement(By.linkText('Users')).click();
	// 8 | click | name=input | 
	await driver.findElement(By.name('input')).click();
	// 9 | type | name=input | testtesttest@test.com
	await driver.findElement(By.name('input')).sendKeys(newUserName);
	// 10 | pause | 3000 | 
	await sleep(4000);
	// 11 | click | css=.ant-btn | 
	await driver.findElement(By.css('.ant-btn')).click();
	await sleep(10000);
	// 15 | click | css=.w-100 | 

	await sleep(5000);
	// 13 | click | css=.about-info:nth-child(2) .info-link | 
	await driver.findElement(By.css('.about-info:nth-child(2) .info-link')).click();
	// 14 | pause | 2000 | 
	await sleep(5000);
	// 15 | click | css=.w-100 | 
	await driver.findElement(By.css('.w-100')).click();
}
async function toTP(code){
	
	const token = totp(code);
  
   
	console.log(code)
	console.log(token); 
	return token;
} 


module.exports = {defineNewUser,emailLogIn,kitLogIn,getNewUser,adminVerifiesNewUser,toTP};




