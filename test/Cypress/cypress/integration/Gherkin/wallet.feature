Feature: Wallet Feature

As a valid customer
In order to Trade/ Deposit and withdraw
I want to create wallets

Scenario: Creating a new user with the current password

    Given I sign up with a random username and the current password 
    When Admin confirms the new user
    Then I registered with the new username
    
Scenario: Successful Wallet Creation 

    Given I  logged in succesfully 
    When I dont have wallets 
    And I genrate TRC20 wallet
    Then I should have TRC20 wallet
    And I genrate ERC20 wallet
    Then I should have ERC20 wallet