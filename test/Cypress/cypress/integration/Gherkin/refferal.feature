Feature:  Referral Feature

As a Hollaex user,
In order to take advantage of my referral
I want to record the referred user

Scenario: run a simple test

    Given I Log in to get the referral code as the referee 
    And Get Referral link "referral code"
    And I have referred X users as the current user
    When  a new "random" user sign up with "referral code"
    Then  I log in as the referee   
    And  I have referred Y users as New user
    When  Y - X = 1
             