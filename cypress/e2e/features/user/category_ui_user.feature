Feature: Category Management UI - User Role

  Background:
    Given the user is logged into the application

  Scenario: Pagination, Search, and Sorting (TC_01, TC_02, TC_03, TC_04)
    When the user navigates to the Category List page
    Then the categories table and pagination should be visible
    When the user searches for "newone"
    Then the table should only show categories containing "newone"
    When the user clicks on the "Name" column header
    Then the categories should be sorted alphabetically

 Scenario: Verify restricted access for User role (TC_05)
    When the user navigates to the Category List page
    Then the "Add A Category" button should not be visible
    # This step now handles the "Visible but Restricted" bugs
    And the Edit and Delete icons should be restricted for the user
    When the user attempts to visit the Add Category URL directly
    Then the user should be redirected to a 403 Forbidden page