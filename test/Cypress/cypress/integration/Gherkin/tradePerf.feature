Feature: Trade Feature

As a valid customer
In order to Trade
I want to login successfully make and take orders

Scenario: Successful Log in and cancell orders

    Given I am in the Hollaex login page as a trader
    And I should be able to redirect to "XHT/USDT" page and cancel all open orders
    And I check the highest and lowest prices
    When I make buy orders "1" times less than 1.1 second
    When I make sell orders "1" times less than 0.55 second
    And I take sell orders "1" times less than 0.45 second
    And I take buy orders "1" times less than 1.5 second
    When I fill "1" of "2" in an order partially less than 0.45 second
    Then I will cancel the order of "1" / "2" percentage less than 1.2 second
    