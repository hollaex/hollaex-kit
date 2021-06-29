//import the selenium web driver
const { Builder, By, Key, until } = require('selenium-webdriver');
var webdriver = require('selenium-webdriver');

var chromeCapabilities = webdriver.Capabilities.chrome();
//setting chrome options to start the browser fully maximized
var chromeOptions = {
	'args': ['--disable-web-security", "--headless","--user-data-dir=true", "--allow-running-insecure-content']
};
chromeCapabilities.set('chromeOptions', chromeOptions);
var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
} 
async function startt() {
	await console.log('1 | open | /ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fh%2Fwcro9khk6y0j%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin |'); 
	await driver.get('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fh%2Fwcro9khk6y0j%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

	console.log('2 | setWindowSize | 1050x660 | ');
	await driver.manage().window().setRect(1050, 660);

	console.log('3 | type&Enter | id=identifierId | youremail@gmail.com');
	await driver.findElement(By.id('identifierId')).sendKeys('alicebitholla@gmail.com');
	await driver.findElement(By.id('identifierId')).sendKeys(Key.ENTER);

	console.log('4 | wait | name=password | Holla!');
	await driver.wait(until.elementsLocated(By.name('password'),30000,'wait', 5000));
	console.log('sleep well for 10');
	await sleep(5000);

	console.log('5 | type&Enter | id=password| your password!');
	await driver.findElement(By.name('password')).sendKeys('Holla2021!');
	await driver.findElement(By.name('password')).sendKeys(Key.ENTER);

	console.log('sleep well for 5');
	await sleep(5000);

	console.log('6 | click | linkText=Refresh | ');
	await driver.findElement(By.linkText('Refresh')).click();
	await driver.findElement(By.css('h3:nth-child(4) font')).click();
	// 4 | click | css=.ts > b | 
	await driver.findElement(By.css('.ts > b')).click();
	// 5 | click | css=td:nth-child(2) > table > tbody:nth-child(1) > tr > td:nth-child(2) | 
	await driver.findElement(By.css('td:nth-child(2) > table > tbody:nth-child(1) > tr > td:nth-child(2)')).click();
	// 6 | assertText | css=h2 b | sandbox XHT Withdrawal Request
	assert(await driver.findElement(By.css('h2 b')).getText() == 'sandbox XHT Withdrawal Request');
	// 7 | click | css=div:nth-child(4) button | 
	vars['windowHandles'] = await driver.getAllWindowHandles();
	// 8 | selectWindow | handle=${win4296} | 
	await driver.findElement(By.css('div:nth-child(4) button')).click();
	// 9 | click | css=.app-bar-account-content > div:nth-child(2) | 
	vars['win4296'] = await waitForWindow(2000);
	// 10 | click | css=.withdrawal-confirm-warpper | 
	await driver.switchTo().window(vars['win4296']);
	// 11 | click | css=.app-bar-account-content > div:nth-child(2) | 
	await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
	// 12 | click | css=.app-bar-account-menu-list:nth-child(11) > .edit-wrapper__container:nth-child(3) | 
	await driver.findElement(By.css('.withdrawal-confirm-warpper')).click();
	await driver.findElement(By.css('.icon_title-text')).click();
	assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success');
};
startt();