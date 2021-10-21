Feature: Promotion?
  As an Admin, I want to change a user promotion rate within the range of 0 to 100, 
  so that give him an incentive.

  Scenario: Discount fee manipulation by admin for userlevel@testsae.com
    Given Admin logged in 
    When Admin adjust the discount rate
    And Discount rate is in the range of Zero to hundred
    Then The user profile page should present the discount rate
