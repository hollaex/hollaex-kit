Feature: Roles Feature

As a valid user with a specific role
In order to check the access of role
I want to to try various  functionalities in HollaeX

Scenario: COMMUNICATOR
   
     Given I am in the Hollaex login page
     When I enter credentials "communicator","Password"
     Then I should be able to login successfully as "communicator@testsae.com"
     And I have title of 'Communicator'
     Then I must be able to do Communicators tasks

Scenario: KYC

     Given I am in the Hollaex login page
     When I enter credentials "kyc","Password"
     Then I should be able to login successfully as "kyc@testsae.com" 
     And I have title of 'KYC'
     Then I must be able to do KYCs tasks

Scenario: SUPERVISOR

     Given I am in the Hollaex login page
     When I enter credentials "supervisor","Password"
     Then I should be able to login successfully as "supervisor@testsae.com"
     And I have title of "Supervisor"
     Then I must be able to do Supervisors tasks

Scenario: SUPPORT

     Given I am in the Hollaex login page
     When I enter credentials "support","Password"
     Then I should be able to login successfully as "support@testsae.com"
     And I have title of "Support"
     Then I must be able to do Supports tasks
 
