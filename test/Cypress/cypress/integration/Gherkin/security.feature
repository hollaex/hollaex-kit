Feature: Security Feature

As a user
In order to manage security 
I want to change the password, active/deactivate 2FA and generate API Keys


Scenario: Creating a new user with the current password

    Given Admin creats a user with a random username and the current password 
    Then The new username is stored

Scenario: Changing password, active/deactivating 2FA, and generating API Keys

    Given I log in as the new user name 
    When I active 2FA
    And I generate API key
    And I request to change the password
    Then I logout successfully

Scenario: Confirm password change by email confirmation

     When I confirm the transfer by Email
     Then I receive a successful message 

Scenario: Successful Login with New Password

    Given  I am on the Hollaex login page and enter credentials
    Then I should be able to login successfully
    And I generate API key
    And I enter incorrect credentials
    And I enter new password as same as the previous password
    And I enter dismatched password
    And I deactivate 2FA
    Then I request to change the password to the previous password

 Scenario: Confirm password change by email confirmation

    When I confirm the transfer by Email
    Then I receive a successful message 

Scenario: Changing deactivating 2FA by Admin

    Given I log in as the new user name 
    When I active 2FA
    Then I logout successfully
    When Admin deactives the 2fa of new user
    Given I log in as the new user name 
    Then The activation code is different 
