Feature: Trade Feature

As a valid customer
In order to Trade
I want to login successfully make and take orders with stop.

Scenario: Successful Login and cancel orders

    Given I am on the Hollaex login page
    When I enter credentials 
    And I should be able to login successfully
    Then I cancel orders

Scenario: Successful making XHT sell order with stop

    Given I am on XHT-USDT trade page
    When I make buy orders
    Then I should be able to see orders
    When I make sell orders
    Then I should be able to see orders

