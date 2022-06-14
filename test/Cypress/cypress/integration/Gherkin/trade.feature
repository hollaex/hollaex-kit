Feature: Trade Feature

As a valid customer
In order to Trade
I want to login successfully make and take orders
@waiting
Scenario: Successful Log in and cancell orders

    Given I am in the Hollaex login page
    When I enter credentials to log in successfully 
    And I should be able to redirect to "XHT/USDT" page and cancel all open orders
    And I check the highest and lowest prices
    When I make buy orders "4" times
    When I make sell orders "4" times
    And I take sell orders "4" times
    And I take buy orders "4" times
    When I fill "1" of "2" in an order partially
    Then I will see the "1" / "2" percentage