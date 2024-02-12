Feature: Reset Password Feature

As a valid customer
In order to change the password
I want to request to HollaeX

Scenario: Creating a new user with the current password

    Given Admin creats a user with a random username and the current password 
    Then The new username is stored

Scenario: Changing password, active/deactivating 2FA, and generating API Keys

    Given I log in as the new user name 

Scenario: Successful  Reset Password

    Given I am on the Hollaex login page
    When I ask for resetting the password, I should be redirected to the related page
    And I should be able to enter my email successfully
    Then I should be redirected contact us page

Scenario: Confirm password change by email confirmation

     When I confirm the transfer by Email
     Then I receive a successful message 

Scenario: the last    

     Then I log in as the very new user name 