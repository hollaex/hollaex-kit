Feature: Signup With Email

As a customer
In order to use Hollaex
I want to register with email confirmation successfully. 

Scenario: Create a New random User for registration

    Given I am in Hollaex signup page
    When I fill up the form
    Then I get a success notification 

Scenario: Successful Email confirmation for new use   

    When I confirm the registration by Email
    Then I am eligible to log in

Scenario: Successfull Login for new user

    Given I am in the Hollaex login page
    When I enter credentials 
    Then I should be able to login successfully