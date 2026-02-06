Feature: User Authentication and Dashboard UI Tests

    Background:
        Given the application is running at "http://localhost:8080"

    @TC_AUTH_UI_USER_01 @ui
    Scenario: TC_AUTH_UI_USER_01 - Login successfully with valid User credentials
        Given I navigate to the login page
        When I enter username "testuser"
        And I enter password "test123"
        And I click the login button
        Then I should be redirected to "/ui/dashboard"
        And the dashboard page should be displayed
        And I should see the categories summary card
        And I should see the plants summary card
        And I should see the sales summary card
        And I should see the inventory summary card

    @TC_AUTH_UI_USER_02 @ui
    Scenario: TC_AUTH_UI_USER_02 - Display validation message for empty Username
        Given I navigate to the login page
        When I leave the username field empty
        And I enter password "test123"
        And I click the login button
        Then I should see validation message "Username is required" below username field

    @TC_AUTH_UI_USER_03 @ui
    Scenario: TC_AUTH_UI_USER_03 - Display validation message for empty Password
        Given I navigate to the login page
        When I enter username "testuser"
        And I leave the password field empty
        And I click the login button
        Then I should see validation message "Password is required" below password field

    @TC_AUTH_UI_USER_04 @ui
    Scenario: TC_AUTH_UI_USER_04 - Display error message for invalid credentials
        Given I navigate to the login page
        When I enter username "testuser"
        And I enter password "wrongpassword"
        And I click the login button
        Then I should see error message "Invalid username or password"
        And I should remain on the login page

    @TC_AUTH_UI_USER_05 @ui
    Scenario: TC_AUTH_UI_USER_05 - View Dashboard with summary information
        Given I am logged in as user via UI
        Then the dashboard page should be displayed
        And I should see the categories summary card with text "Organize plant structure"
        And I should see the plants summary card with text "Manage plant details"
        And I should see the sales summary card with text "Sales overview"
        And I should see the inventory summary card with text "Track stock movement"
        And the navigation menu should include "Dashboard" link
        And the navigation menu should include "Categories" link
        And the navigation menu should include "Plants" link
        And the navigation menu should include "Sales" link
        And the navigation menu should include "Inventory" link
        And the navigation menu should include "Logout" link