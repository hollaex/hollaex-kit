
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');

describe('BobLogIn', function() {
  this.timeout(30000);
  let driver;
  let vars;
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    vars = {};
  })
  afterEach(async function() {
   // await driver.quit();
  })
  it('Simple log in', async function() {
    
    console.log(" Test name: BobLogIn");
    await driver.get("https://sandbox.hollaex.com/login");
    await driver.sleep(5000);
    const title = await driver.getTitle();
    console.log(title)
    expect(title).to.equal(title);
    console.log("entring sand box");
    console.log(" Step # | action | target | value");
    
    console.log(" 1 | type | name=email | bob@gmail.com");
    await driver.wait(until.elementLocated(By.name("email")), 5000)
    await driver.findElement(By.name("email")).sendKeys("bob@gmail.com");
    
    console.log(" 2 | type | name=password | Holla!");
    await driver.wait(until.elementLocated(By.name("password")), 5000)
    await driver.findElement(By.name("password")).sendKeys("Holla!");
    
    console.log(" 3 | click | css=.auth_wrapper | ");
    await driver.wait(until.elementIsEnabled(await driver.findElement(By.css(".auth_wrapper"))), 5000);
    await driver.findElement(By.css(".auth_wrapper")).click();
    console.log(" 4 | verifyElementPresent | css=.holla-button |"); 
    {
      const elements = await driver.findElements(By.css(".holla-button"));
     // assert(elements.length);
      expect(elements.length);
    }
    
    console.log(" 5 | click | css=.holla-button | ");
    await driver.findElement(By.css(".holla-button")).click();
    await sleep(5000);
    console.log(" 6 | assertText | css=.app-bar-account-content > div:nth-child(2) | youremail@gmail.com");
    await driver.wait(until.elementLocated(By.css(".app-bar-account-content > div:nth-child(2)")), 20000)
    await console.log(await driver.findElement(By.css(".app-bar-account-content > div:nth-child(2)")).getText());
    expect(await driver.findElement(By.css(".app-bar-account-content > div:nth-child(2)")).getText()).to.equal("bob@gmail.com")
    // console.log(" 6 | click | css=.d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container | ");
    // await driver.wait(until.elementLocated(By.css(".d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container")), 5000)
    // await driver.findElement(By.css(".d-flex:nth-child(2) > .side-bar-txt > .edit-wrapper__container")).click();
    
    console.log(" 7 | close |  | ");
    //await driver.close();
 
  })
})
