Feature: History Feature

As a user
In order to check transactions and trade records
I want to check time and pair filters on data and pagination.
@waitings
Scenario: Successful order History check

    Given I am on the Hollaex history page
    When I select each coin pair in the Trades, for all time-frame, pagination should work well
    Then I should be able to click on Order history
    When I select each coin pair in the Trades, for all time-frame,  pagination should work well for closed orders
    And I select each coin pair in the Trades, for all time-frame, pagination should work well for open orders
@waitings
Scenario: Successful withdrawals ad deposits check

    Given I am on the Hollaex Deposit history page
    When I select each coin  in the Deposits,  pagination should work well
    Then I should be able to check the deposit status 

    Given I am on the Hollaex Withdrawals history page
    When I select each coin  in the Withdrawals,  pagination should work well

@waitings
Scenario: Successful download 