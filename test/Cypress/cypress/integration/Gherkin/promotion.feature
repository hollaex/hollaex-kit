Feature: Promotion Feature

As an Admin, 
In order to give a user an incentive.
I want to change a user promotion rate within the range of 0 to 100
  
Scenario: Discount fee manipulation by admin for userlevel@testsae.com

    Given Admin logged in 
    When Discount rate is in the range of "zero" to "hunderd" for "leveltest@testsae.com"
    And  Admin adjust the discount rate for a user "userlevel@testsae.com"
    Then The user profile page of "userlevel@testsae.com" should present the discount rate
