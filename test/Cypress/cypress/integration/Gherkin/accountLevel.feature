Feature: Promotion Feature
  
As an Admin, 
In order to give a user an incentive.
I want to change a user level within the limited range of 1 to 11

Scenario: Account level manipulation by admin for userlevel@testsae.com
 
    Given Admin logged in and find "userlevel@testsae.com" 
    When Choose new level  in the range of "1" to "11"
    And  Admin confirms the level for a user "userlevel@testsae.com"
    Then The user profile page of "userlevel@testsae.com" should present the level
