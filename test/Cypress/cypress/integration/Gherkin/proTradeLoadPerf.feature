Feature: Market Load Feature

As a valid customer
In order to test the performance of trade market loading
I want to login successfully to HollaeX and check wallet

Scenario: Market load time

    Given I am in the Hollaex login page
    When I enter credentials Username,Password
    Then I should be able to view "XHT/USDT" market within 10505.3 ms