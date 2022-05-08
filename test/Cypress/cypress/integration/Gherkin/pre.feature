Feature: Per cond Feature

As a tester
In order to check pre conditions
I want to check to HollaeX
@pre
Scenario: Successfull check

    Given I log in as an admin
    When language is English     
    And Ask for confirmation before submitting orders is off
    And Show pop up when order has been completed if off             
    And Show pop up when order has partially filled is off
    And All Audio cues is off
    And Bob 2fa is desabled 
    And chatbox is off
    And XHTT spread in market is less than 0.001       
 
