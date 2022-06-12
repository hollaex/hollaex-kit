Feature: Onboarding Feature

As an Admin
In order to control the user registration in Hollaex
I want to active and deactivate new user registration with/without email 

 @waiting 
Scenario: Disallow a New User to register

    Given I am on admin page 
    And I disallow new sign-ups
    When user fills registration email textbox with "randomaUsername",'@testsae.com',and user clicks "sign up"  
    Then "Sign up not available" Should be appeared
    And "randomaUsername" can not log in 
@waiting 
Scenario: Allow a New User to register without confirmation

    Given I am on admin page 
    And I allow new sign-ups
    And I disable Enable email verification requirement
    When user fills registration email textbox with "randomaUsername",'@testsae.com',and user clicks "sign up"  
    Then "randomaUsername" can log in 





