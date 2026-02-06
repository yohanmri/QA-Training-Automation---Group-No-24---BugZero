Feature: Admin Authentication and Dashboard UI Tests

    Background:
        Given the application is running at "http://localhost:8080"

    @TC_AUTH_UI_ADMIN_01
    Scenario: TC_AUTH_UI_ADMIN_01 - Successful login with valid Admin credentials
        Given I navigate to the login page
        When I enter username "admin"
        And I enter password "admin123"
        And I click the login button
        Then I should be redirected to "/ui/dashboard"
        And the dashboard page should be displayed
        And I should see the categories summary card
        And I should see the plants summary card
        And I should see the sales summary card
        And I should see the inventory summary card

    @TC_AUTH_UI_ADMIN_02
    Scenario: TC_AUTH_UI_ADMIN_02 - Validation for both empty fields (Admin)
        Given I navigate to the login page
        When I leave the username field empty
        And I leave the password field empty
        And I click the login button
        Then I should see validation message "Username is required" below username field
        And I should see validation message "Password is required" below password field

    @TC_AUTH_UI_ADMIN_03
    Scenario: TC_AUTH_UI_ADMIN_03 - Successful logout with success message
        Given I am logged in as admin via UI
        When I click the logout link
        Then I should be redirected to "/ui/login"
        And I should see success message "logged out successfully"
        When I navigate to "/ui/dashboard"
        Then I should be redirected to "/ui/login"

    @TC_AUTH_UI_ADMIN_04
    Scenario: TC_AUTH_UI_ADMIN_04 - Navigation menu highlights active page (Admin)
        Given I am logged in as admin via UI
        Then the dashboard page should be displayed
        And the navigation menu should be visible
        And the "Dashboard" link should be highlighted in navigation
        When I click on "Categories" in navigation menu
        Then I should be redirected to "/ui/categories"
        And the "Categories" link should be highlighted in navigation
        And the "Dashboard" link should not be highlighted

    @TC_AUTH_UI_ADMIN_05
    Scenario: TC_AUTH_UI_ADMIN_05 - Display summary cards with correct data (Admin)
        Given I am logged in as admin via UI
        Then the dashboard page should be displayed
        And the categories summary card should show count
        And the plants summary card should show total count
        And the sales summary card should show revenue
        When I click "Manage Categories" button
        Then I should be redirected to "/ui/categories"