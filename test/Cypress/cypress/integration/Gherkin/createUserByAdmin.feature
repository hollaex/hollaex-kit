Feature: Admin creates new user
As an admin I want to create a new user So that they can access Hollaex Kit
Scenario: Admin creates a new user
	Given I am logged in as an admin
	When I navigate to the Create User page
	Then I should see a form for creating a new user

    When I try to create a user with an existing username
	Then I should see an error message of bad
    
    When I try to create a user with an diffrent passwords
	Then I should see an error message

	When I fill out the form with valid user information
	And I submit the form
	Then the user should be created successfully
	And I should see a success message

Scenario: The New User Successfull Login

    Given I am in the Hollaex login page
    When I enter credentials Username,Password
    Then I should be able to login successfully

	
Scenario: Non Admin creates a new user
	When a non-admin user tries to create a new user
	Then they should be denied access
