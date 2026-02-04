Feature: Authentication and Dashboard UI - User

    Background:
        Given I navigate to the login page

    @ui @user @smoke
    Scenario: TC_AUTH_UI_USER_01 - Successful login with valid User credentials
        When I enter username "user"
        And I enter password "user123"
        And I click the login button
        Then I should be redirected to the dashboard
        And the Dashboard page should be displayed

    @ui @user @validation
    Scenario: TC_AUTH_UI_USER_02 - Display validation message for empty Username
        When I enter password "user123"
        And I click the login button
        Then I should see validation message "Username is required"

    @ui @user @validation
    Scenario: TC_AUTH_UI_USER_03 - Display validation message for empty Password
        When I enter username "user"
        And I click the login button
        Then I should see validation message "Password is required"

    @ui @user @negative
    Scenario: TC_AUTH_UI_USER_04 - Display error message for invalid credentials
        When I enter username "user"
        And I enter password "wrongpassword"
        And I click the login button
        Then I should see error message "Invalid username or password"
        And I should remain on the login page

    @ui @user @smoke
    Scenario: TC_AUTH_UI_USER_05 - View Dashboard with summary information
        Given user is logged in as "user"
        When I am on the Dashboard page
        Then I should see the Categories summary card
        And I should see the Plants summary card
        And I should see the Sales summary card
        And I should see the Inventory summary card
        And I should see the navigation menu with all links