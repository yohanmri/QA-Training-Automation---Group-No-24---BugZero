Feature: User Authentication

  Background:
    Given I navigate to the login page

  @ui @admin @smoke
  Scenario: Admin successful login
    When I enter username "admin"
    And I enter password "admin123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see admin menu options

  @ui @user @smoke
  Scenario: User successful login
    When I enter username "user"
    And I enter password "user123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should not see admin action buttons

  @ui @negative
  Scenario: Login with invalid credentials
    When I enter username "invaliduser"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see error message "Invalid username or password"

  @ui @validation
  Scenario: Login with empty username
    When I enter password "admin123"
    And I click the login button
    Then I should see validation message "Username is required"

  @ui @validation
  Scenario: Login with empty password
    When I enter username "admin"
    And I click the login button
    Then I should see validation message "Password is required"

  @ui @negative
  Scenario: Login with both fields empty
    When I click the login button
    Then I should see validation message "Username is required"
