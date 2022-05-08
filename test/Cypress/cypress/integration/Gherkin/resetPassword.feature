Feature: Reset Password Feature

As a valid customer
In order to change the password
I want to request to HollaeX

Scenario: Successful  Reset Password

    Given I am on the Hollaex login page
    When I ask for resetting the password, I should be redirected to the related page
    And I should be able to enter my email successfully
    Then I should be redirected contact us page