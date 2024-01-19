Feature: Resend Verification Email Feature

As a valid customer
In order to get a verification email
I want to request to HollaeX

Scenario: Successful  Verification Email Request

    Given I am on the Hollaex signup page
    When I ask for a resending verification email, I should be redirected to the related page
    And I should be able to enter my email successfully
    Then I should be redirected contact us page
Scenario: Successful Email confirmation for new use   

    When I confirm the registration by Email
    Then I am eligible to log in

Scenario: Successfull Login for new user

    Given I am in the Hollaex login page
    When I enter credentials 
    Then I should be able to login successfully and Verification email should be the same