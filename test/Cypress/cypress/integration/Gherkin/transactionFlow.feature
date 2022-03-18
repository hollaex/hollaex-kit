Feature: Crpto transfer Feature

As a valid customer
In order to  Deposit and withdraw
I want to send some amount of crypto

Scenario: Successful Mininal XHT transfer from Bob to Alice

    Given Alice logged in successfully 
    And Alice has X amount of XHT
    When Bob logged in successfully 
    And Bob transferred a minimal amount of XHT to Alice

Scenario: Successful Mininal XHT receiving from Bob     

    When Bob confirm the transfer by Email
    Then Alice has received the minimal amount of XHT