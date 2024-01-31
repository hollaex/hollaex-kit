Feature: Temporary Account Lockout on Multiple Failed Login Attempts

  In order to secure user accounts from unauthorized access attempts,
  As a security measure,
  The Hollaex system should temporarily lock a user's account after multiple failed login attempts.

  Scenario: User enters wrong password multiple times leading to a temporary account lock
    Given the user keys in the wrong password for the first time
    And the user keys in the right password for the first time
    And the user keys in the wrong password for the second time
    And the user keys in the right password for the second time
    And the user keys in the wrong password for the third time
    And the user keys in the right password for the third time
    And the user keys in the wrong password for the fourth time
    And the user keys in the right password for the fourth time
    When the user keys in the wrong password for the fifth time
    Then the user should see the message "You attempted to login too many times, please wait for a while to try again"
    When the user attempts to log in with the wrong password after 1 minute
    Then the user should see the message "You attempted to login too many times, please wait for a while to try again"
    And the user should wait for 5 minutes
    Then the user keys in the right password and log in
