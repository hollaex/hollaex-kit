Feature: Crpto transfer Feature

As a valid customer
In order to  Deposit and withdraw
I want to send some amount of crypto

Scenario: Successful Mininal XHTT transfer from Bob to Alice

    Given Alice logged in successfully 
    And Alice has X amount of XHTT
    When Bob logged in successfully 
    And Bob enables 2FA
    And Bob transferred a minimal amount of XHTT to Alice
    And Bob disables 2FA

Scenario: Successful Mininal XHTT receiving from Bob     

    When Bob confirm the transfer by Email

Scenario: Alice received Mininal XHTT from Bob Successful  
    
    And Bob confirms that has sent the minimal amount of XHTT
    Then Alice has received the minimal amount of XHTT
    
 Scenario: UnSuccessful Mininal XHTT transfer from Bob to Alice

    When Bob logged in successfully 
    And Bob transferred a minimal amount of XHTT to wrong Alice address 
    
Scenario: Successful Mininal XHTT receiving from Bob     

    When Bob confirm the transfer by Email

Scenario: Bob has not sent the Mininal XHTT   
    
    When Bob confirms that has not sent the minimal amount of XHTT
    Then Bob cancels the transfer   

Scenario: UnSuccessful Mininal XHTT transfer from Bob to outside Alice adress

    When Bob logged in successfully 
    And Bob transferred a minimal amount of XHTT to real Alice address 
    
Scenario: Successful Mininal XHTT receiving from Bob     

    When Bob confirm the transfer by Email

Scenario: Bob has not sent the Mininal XHTT  
    
    When Bob confirms that has not sent the minimal amount of XHTT
    Then Bob cancels the transfer 