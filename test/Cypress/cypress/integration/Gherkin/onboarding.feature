Feature: Onboarding Feature

As an Admin
In order to control the user registration in Hollaex
I want to active and deactivate new user registration with/without email 

  
Scenario: Disallow a New User to register

    Given I am logged in as an admin 
    And I disallow new sign-ups
    When I am in Hollaex signup page  
    And I fill up the form
    Then I get a unsuccess notification 

Scenario: Allow a New User to register without confirmation

    Given I am logged in as an admin 
    And I allow new sign-ups
    And I disable Enable email verification requirement
    When A non verified user tries to login  
    Then He can log in 
 
 Scenario: Disallow a New User to register without confirmation

    Given I am logged in as an admin 
    And I Enable email verification requirement
    When A non verified user tries to login  
    Then He can not log in 
 



