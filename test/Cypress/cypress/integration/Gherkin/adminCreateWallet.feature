Feature: Admin creates a wallet address for a new user

  Scenario: Create a new XHT wallet address successfully
    Given an admin is logged in
    When Admin create a new user
    And Admin create a new XHT wallet address for the user

Scenario: The new user login and check wallet's address   
    When the user logs in to Hollaex
    Then the user wallet address should be the same as the one created by the admin
