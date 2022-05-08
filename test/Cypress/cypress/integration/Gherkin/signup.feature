Feature: Signup Feature

As a customer
In order to use Hollaex
I want to register successfully 

Background: 

    Given user on the homepage  
    And user should click "Signup"  

Scenario: Create a New User with aid of Admin

    When user fills registration email textbox with "randomaUsername",'@testsae.com',and user clicks "sign up"  
    And "randomaUsername" can not login
    When "admin" confirms  "randomaUsername"
    Then "randomaUsername" can login

Scenario: Rejection of wrong username and password

    When user fills registration email textbox with "existed" and "@testsae.com"  
    And user enters the "weakPassword"
    And user enters the "diffrentPassword" as well
    And user arbitrary enter "Wrong Referral code"

