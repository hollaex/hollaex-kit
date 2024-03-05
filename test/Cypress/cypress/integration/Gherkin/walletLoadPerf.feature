Feature: Wallet Load Balance Feature

As a valid customer
In order to test the performance of wallet loading
I want to login successfully to HollaeX and check wallet

Scenario: Wallet load time

    Given I am in the Hollaex login page
    When I enter credentials Username,Password
    Then I should be able to view the wallet balances within 2594.199999988079 ms