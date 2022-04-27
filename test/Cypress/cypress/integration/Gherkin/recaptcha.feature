Feature: reCAPATCHA Feature

As a valid customer
In order to ensure that my account is protected from spam and abuse
I want to login successfully to HollaeX with reCAPATCHA

Scenario: Successfull Login

    Given I am in the Hollaex login page
    When wait 5 second
    And reCaptcha appears
    Then I should be able to login successfully


