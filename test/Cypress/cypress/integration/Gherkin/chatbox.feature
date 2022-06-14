Feature: Login Feature

As an Admin
In order to check the chatbox
I want to send/delete a message,and ban/unban a user.

Scenario: Successful Chatbxot feature

    Given I log in the Hollaex 
    And I should be able to make the chatbox visible 
    And I should be able to enter a message
    And I should be able to delete a message 
    And I should be able to ban a user
    And I should be able to unban a user
    Then I should be able to make the chatbox invisible 