const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const fs = require('fs');
const readline = require('readline');
//let path = 'D:/Github/mahdi-kit/test/selenium/Onboarding/.log/LogIn/test.txt'
let path = 'D:/GitHub/mahdi-kit/test/selenium/Onboarding/.log/Promotion/log.txt'
const buffer = fs.readFileSync(path);
const file = buffer.toString();
//console.log(file)

         Given('Admin logged in', function () {
          if(file.includes('1')){
            return 'true';
           }else{
             return 'pending'
           }
         });


         When('Admin adjust the discount rate', function () {
          if(file.includes('7')){
            return 'true';
           }else{
             return 'pending'
           }
         });


         When('Discount rate is in the range of Zero to hundred', function () {
          if(file.includes('19.2')){
            return 'true';
           }else{
             return 'pending'
           }
           
         });


         Then('The user profile page should present the discount rate', function () {
          if(file.includes('30')){
            return 'true';
           }else{
             return 'pending'
           }
         });