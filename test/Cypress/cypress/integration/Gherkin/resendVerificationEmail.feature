Feature: Resend Verification Email Feature

As a valid customer
In order to get a verification email
I want to request to HollaeX

Scenario: Successful  Verification Email Request

    Given I am on the Hollaex signup page
    When I ask for a resending verification email, I should be redirected to the related page
    And I should be able to enter my email successfully
    Then I should be redirected contact us page
