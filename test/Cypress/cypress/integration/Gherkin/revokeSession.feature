Feature: Revoking session Feature

As a valid customer
In order prevent other from accessing the system without verifying their credentials
I want to revoke its current session successfully

Scenario: Successfull Revoke

    Given I am in the Hollaex login page
    When I enter credentials "Username","Password"
    Then I should be able to login successfully
    And I should be in "Account" page with "Username"
    Then I should be able to revoke ny current session successfully

