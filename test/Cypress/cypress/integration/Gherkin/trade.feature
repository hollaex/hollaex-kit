Feature: Trade Feature

As a valid customer
In order to Trade
I want to login successfully make and take orders

Scenario: Successful Log in and cancell orders

    Given I am in the Hollaex login page
    When I enter credentials to log in successfully 
    And I should be able to redirect to "XHTT/USDT" page and cancel all open orders
    And I check the highest and lowest prices
    When I make buy orders "1" times
    When I make sell orders "0" times
    And I take sell orders "1" times
    And I take buy orders "0" times
    When I fill "1" of "2" in an order partially
    Then I will see the "1" / "2" percentage