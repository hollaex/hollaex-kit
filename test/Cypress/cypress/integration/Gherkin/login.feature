Feature: Login Feature

As a valid customer
In order to Trade/ Deposit and withdraw
I want to login successfully to HollaeX

Scenario: Successfull Login

    Given I am in the Hollaex login page
    When I enter credentials Username,Password
    Then I should be able to login successfully

Scenario: Wrong Username Login

    Given I am in the Hollaex login page
    When I enter credentials Wrong Username,Password
    Then I should not be able to login successfully and get error

Scenario: Wrong Password login

    Given I am in the Hollaex login page
    When I enter credentials Username,wrong Password
    Then I should not be able to login successfully and get error

Scenario: Frozen Account login

    Given I am in the Hollaex login page
    When I enter credentials Frozen Username,Password
    Then I should not be able to login successfully and get This account is frozen

Scenario: 2FA enabled Account login

    Given I am in the Hollaex login page
    When I enter credentials 2FA enabled Username,Password
    Then I should be able to login successfully
    And I enter Expired,long,short and then true 2FA code
    