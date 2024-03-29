Feature: Hollaex Footer

As an Admin
In order to customize landing page
I want to manipulate the footer 
 
Scenario: Successful features changes

    Given I log in the Hollaex 
    When I change the  Exchange description 
    Then Footer Exchange description should be changed 
    When I change Footer small text
    Then Footer small text should be changed
    When I change Referral Badge 
    Then Referral Badge should be changed
    When I add a column in Footer Links 
    Then The column should be on the Footer page
    When I delete a column in Footer Links 
    Then The column should not be on the Footer page
    When I hided referral badge
    Then Referral badge should be hidden
