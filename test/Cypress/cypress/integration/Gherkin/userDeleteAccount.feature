Feature: Account deleting Feature

As a user
In order to manage security 
I want to cdelete my account

Scenario: Creating a new user with the current password

    Given Admin creats a user with a random username and the current password 
    Then The new username is stored

Scenario: User delets his account

    Given I log in as the new user name