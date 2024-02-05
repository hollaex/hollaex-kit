Feature: Hollaex Feature

As an Admin
In order to what???
I want to enable and disable some Hollaex features
  
Scenario: Successful features changes

    Given I log in the Hollaex 
    When I check all features 
    And I should be able to enable or disable Pro trade
    And I should be able to enable or disable Quick trade
    And I should be able to enable or disable Defi Staking
    And I should be able to enable or disable Cefi Staking
    And I should be able to enable or disable Fiat Contorols
    And I should be able to enable or disable Chat system
    And I should be able to enable or disable Apps
    And I should be able to enable or disable Homepage
    Then I should be able to disable Chat system