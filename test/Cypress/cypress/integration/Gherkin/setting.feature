Feature: Setting Feature

As an Admin
In order to manage setting
I want to change the language

Scenario: Successful language changing

    Given I logged in Hollaex 
    When I change language, it should change
    Then I did the test successfully