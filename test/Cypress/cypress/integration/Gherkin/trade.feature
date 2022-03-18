Feature: Trade Feature

As a valid customer
In order to Trade
I want to login successfully make and take orders

Scenario: Successful Log in and cancell orders

    Given I am in the Hollaex login page
    When I enter credentials 
    And I should be able to login successfully
    Then I cancel orders
    When I make buy orders
    Then I should be able to see orders
    When I make sell orders
    Then I should be able to see orders
    When I take buy orders
    Then I should be able to see these
    When I take sell orders
    Then I should be able to see these