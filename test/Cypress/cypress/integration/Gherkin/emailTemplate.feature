Feature: Edit Email template
  As Admin
  I want to be able to edit the content of a set of predefined emails
  So that I can customize them for my specific needs

  Scenario: Edit Email Content
    Given I am logged in as Admin
    When I navigate to the customize emails section
    And I select an email type of 'login' to edit
    Then the email content and title should be displayed, and should be stored
    And I should be able to make changes to the email content and title
    When I click on the save button
    Then the changes should be saved
    And I should see a confirmation message
    And the email langs should be updated with my changes from 'فارسی' to 'English'
	  
Scenario: One user loging 
    Given I am on the login page
    When I enter "tester+loginer@hollaex.email" as my email address
	Then I should be logged in as 'tester+loginer@hollaex.email'

Scenario: Cheking mailbox
    Given I logged in my email
	When I check my email inbox
    Then I should see the edited email in 'tester+loginer@hollaex.email' inbox
    And the email content should match the changes I made
 
Scenario: Restore Email Content
    Given I am logged in as Admin
    When I navigate to the customize emails section
    And I select an email type of 'login' to edit
    Then the email content and title should be restored to its original state