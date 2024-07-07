Feature: Add Role Feature

As an Admin
In order to give roles to operators
I want to assign and change a role to a user and non member user

Scenario: Admin assignes, reassignes, changes and revokes a role to a user

    Given Admin created a new user 
    When Admin gave the new user supprot role
    Then The new user is in the role table with support role
    When Admin gave to the same user the support role again
    Then Error of User is already an operator will come up
    When Admin changed the new user role to communicator
    Then The new user is in the role table with communicator role
    When Admin revoked the role from the new user
    Then The new user is not in the role table anymore
    When Admin gives a non-member user a Role
    Then The new user is in the role table with supervisor role

Scenario: The user login as the supervisor
    Given The user got the temporary password is saved
    And The user can loged in
    Then The status is supervisor

