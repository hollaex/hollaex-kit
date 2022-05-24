Feature: Manage Risk Feature
  
As a user, 
In order to have a threshold for the amount of trading
I want to receive a warning when I exceed the threshold. 
@waiting
Scenario:  Successful Changing the risk percentage for userlevel@testsae.com
 
    Given I log in with the account "userlevel@testsae.com" 
    When I activate Risk Management
    And I choose a new percentage in the range of "1" to "101"
    And I make an open order size randomly bigger than the new   percentage
    Then I will get  "Risky Trade Detected" message with the rate and the total amount
@waiting
Scenario:  unsuccessful Changing the risk percentage for userlevel@testsae.com
 
    Given I log in with the account "userlevel@testsae.com" 
    When I deactivate Risk Management
    And I make an open order size randomly bigger than the new   percentage
    Then I will get no "Risky Trade Detected" message
    Then I reset percentage to '90'% and activate Risk Management.