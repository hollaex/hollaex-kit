Feature: User search Feature

As an admin
In order to handle users' affairs
I want to find and manipulate users' data easily
@waiting
Scenario: Successful Search

    Given I am on the Hollaex login page
    When I search a user by its 'ID', 'Email' and 'USERNAME' 
    Then I should see the same result
@waiting
Scenario: Manipulating a user data 

    Given I am on the Hollaex login page
    And I am able to change trading Fee discount
    And I am able to verify a user's Email 
    And I am able to enable and disable 2FA for a user
    And I am able to freeze an account
    And I am able to Flag and Unflag a user
@waiting
Scenario:  Manipulating a user identification files
   Given I am on the Hollaex login page
   And I am able to edit and delete note for a user 
   And I am able to upload documents for a user 
   And I am able to set user status to 'approved', 'pending', and rejected
   Then I am able to view a user's date
@waiting
Scenario: Manipulating a user information
    Given I am on the Hollaex login page
    And I am able to  change a user's role
    And I am able to  change a user's level
    Then I am able to edit user data
@waiting
Scenario: Successful handling of Bank for a user
@waiting
Scenario: Successful  Balance check for a user
        Given I am on Hollaex page
        And I make an active order to sell '0.01' amount of 'XHT'
        And I checked my 'Hollaex' wallet balance 
        When I search for a user with 'USERNAME'
        And I check the balance should be same as the wallet balance
        Then Balance - Available should be '0.01'
        Then in order/'XHT-USDT'/active orders/'Asks'/Size should be '0.01'
        And cancel the active order
        Then Balance - Available should be '0'
@waiting       
Scenario: Successful Orders check for a user
Scenario: Successful Trade history check for a user
Scenario: Successful Deposits check for a user
Scenario: Successful Withdrawal check of a user
Scenario: Successful Meta configuration 

